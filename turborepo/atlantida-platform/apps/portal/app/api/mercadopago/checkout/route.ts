import { NextResponse } from 'next/server';
import { preApproval } from '@/lib/mercadopago';

export async function POST(req: Request) {
    try {
        const { planId, userEmail, userId, isYearly, coupon } = await req.json();

        // Precios en UYU (alineados con la página de pricing). Anual = -20% sobre mensual.
        let monthlyAmounts = planId === 'premium' ? 3600 : 1600;
        if (isYearly) monthlyAmounts = Math.round(monthlyAmounts * 0.8);
        // Cupón Fundador: 30% OFF de por vida
        const monthlyCharge = coupon === 'FUNDADOR30' ? Math.round(monthlyAmounts * 0.7) : monthlyAmounts;
        const planDetails = {
            title: planId === 'premium' ? 'Plan Premium - Barrio.uy' : 'Plan Pro - Barrio.uy',
            amount: monthlyCharge,
        };

        const body = {
            back_url: `${process.env.NEXT_PUBLIC_APP_URL}/publish/success`,
            reason: planDetails.title,
            auto_recurring: {
                frequency: 1,
                frequency_type: 'months',
                transaction_amount: planDetails.amount,
                currency_id: 'UYU',
            },
            payer_email: userEmail,
            status: 'pending',
            external_reference: userId, // Critical for identifying the user in webhook
        };

        const response = await preApproval.create({ body });

        return NextResponse.json({
            init_point: response.init_point,
            id: response.id
        });

    } catch (error: any) {
        console.error('Mercado Pago Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
