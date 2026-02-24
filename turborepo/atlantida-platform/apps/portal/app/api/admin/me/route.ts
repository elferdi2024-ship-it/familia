import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

const CREATOR_EMAILS = (process.env.CREATOR_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

function getToken(req: Request): string | null {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.slice(7);
}

/** Solo cuando Firebase Admin no está configurado (ej. dev): lee email del payload del JWT para comprobar CREATOR_EMAILS. No verifica firma. */
function getEmailFromTokenUnsafe(token: string): string | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
        const email = payload.email ?? null;
        return typeof email === 'string' ? email.toLowerCase() : null;
    } catch {
        return null;
    }
}

export async function GET(req: Request) {
    try {
        const token = getToken(req);
        if (!token) return NextResponse.json({ canManage: false }, { status: 200 });

        if (adminAuth && adminDb) {
            const decoded = await adminAuth.verifyIdToken(token);
            const uid = decoded.uid;
            const email = (decoded.email || '').toLowerCase();

            if (CREATOR_EMAILS.includes(email)) {
                return NextResponse.json({ canManage: true, role: 'creator' });
            }

            const userSnap = await adminDb.collection('users').doc(uid).get();
            const role = userSnap.data()?.role;
            if (role === 'admin' || role === 'creator') {
                return NextResponse.json({ canManage: true, role });
            }
            return NextResponse.json({ canManage: false }, { status: 200 });
        }

        // Fallback dev: sin Firebase Admin configurado, solo comprobar email del JWT (no verificado)
        const email = getEmailFromTokenUnsafe(token);
        if (email && CREATOR_EMAILS.includes(email)) {
            return NextResponse.json({ canManage: true, role: 'creator' });
        }
        return NextResponse.json({ canManage: false }, { status: 200 });
    } catch {
        return NextResponse.json({ canManage: false }, { status: 200 });
    }
}
