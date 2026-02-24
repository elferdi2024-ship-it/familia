import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

const CREATOR_EMAILS = (process.env.CREATOR_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

const ALLOWED_PLANS = ['free', 'pro', 'premium', 'elite'] as const;

function getToken(req: Request): string | null {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.slice(7);
}

async function canManage(uid: string, email: string): Promise<boolean> {
    if (CREATOR_EMAILS.includes(email)) return true;
    const userSnap = await adminDb.collection('users').doc(uid).get();
    const role = userSnap.data()?.role;
    return role === 'admin' || role === 'creator';
}

export async function POST(req: Request) {
    try {
        if (!adminAuth || !adminDb) return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 });
        const token = getToken(req);
        if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

        const decoded = await adminAuth.verifyIdToken(token);
        const requesterUid = decoded.uid;
        const requesterEmail = (decoded.email || '').toLowerCase();

        const allowed = await canManage(requesterUid, requesterEmail);
        if (!allowed) return NextResponse.json({ error: 'No tienes permiso para gestionar planes' }, { status: 403 });

        const body = await req.json();
        const { plan, userId: targetUserId } = body;

        if (!plan || !ALLOWED_PLANS.includes(plan)) {
            return NextResponse.json({ error: 'Plan no válido. Usa: free, pro, premium o elite.' }, { status: 400 });
        }

        const targetUid = typeof targetUserId === 'string' && targetUserId.trim()
            ? targetUserId.trim()
            : requesterUid;

        if (targetUid !== requesterUid && !(await canManage(requesterUid, requesterEmail))) {
            return NextResponse.json({ error: 'No puedes cambiar el plan de otro usuario' }, { status: 403 });
        }

        await adminDb.collection('users').doc(targetUid).set(
            { plan, updatedAt: new Date().toISOString() },
            { merge: true }
        );

        return NextResponse.json({ ok: true, plan, userId: targetUid });
    } catch (e) {
        console.error('set-plan error', e);
        return NextResponse.json({ error: 'Error al actualizar el plan' }, { status: 500 });
    }
}
