import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Mercado Pago Webhook received:', body);

        // Webhook implementation for subscriptions (Preapproval)
        // Mercado Pago sends periodic notifications about the status of the subscription

        const { action, data } = body;

        if (action === 'preapproval.updated' || action === 'preapproval.created') {
            const preapprovalId = data.id;

            // In a real implementation, you would fetch the full preapproval object
            // to get the external_reference (userId) and current status.
            // For now, we simulate the logic:

            /*
            const response = await preApproval.get({ id: preapprovalId });
            const userId = response.external_reference;
            const status = response.status;
            
            if (status === 'authorized') {
              const tier = response.reason.includes('Premium') ? 'elite' : 'pro';
              await adminDb.collection('users').doc(userId).update({
                plan: tier,
                subscriptionId: preapprovalId,
                subscriptionStatus: 'active',
                updatedAt: new Date(),
              });
            }
            */

            console.log(`Processing preapproval ${preapprovalId}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: unknown) {
        console.error('Mercado Pago Webhook Error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
