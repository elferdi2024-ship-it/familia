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

export async function GET(req: Request) {
    try {
        if (!adminAuth || !adminDb) return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 });
        const token = getToken(req);
        if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;
        const email = (decoded.email || '').toLowerCase();

        const userSnap = await adminDb.collection('users').doc(uid).get();
        const role = userSnap.data()?.role;
        const isCreator = CREATOR_EMAILS.includes(email) || role === 'admin' || role === 'creator';
        if (!isCreator) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

        const snapshot = await adminDb.collection('users').limit(200).get();
        const users = snapshot.docs.map((d) => {
            const data = d.data();
            return {
                uid: d.id,
                displayName: data.displayName ?? null,
                email: data.email ?? null,
                plan: data.plan ?? 'free',
                role: data.role ?? null,
                updatedAt: data.updatedAt ?? null,
            };
        });

        return NextResponse.json({ users });
    } catch (e) {
        console.error('admin users error', e);
        return NextResponse.json({ error: 'Error al listar usuarios' }, { status: 500 });
    }
}
