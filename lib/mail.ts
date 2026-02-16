import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface LeadEmailData {
    propertyTitle: string
    propertyId: string
    propertyPrice?: number
    propertyCurrency?: string
    leadName: string
    leadEmail: string
    leadPhone?: string
    leadMessage: string
}

export async function sendLeadEmail(to: string, leadData: LeadEmailData) {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is missing");
        return { success: false, error: "Configuration error" };
    }

    const priceDisplay = leadData.propertyPrice
        ? `${leadData.propertyCurrency || 'USD'} ${leadData.propertyPrice.toLocaleString()}`
        : ''

    try {
        const { data, error } = await resend.emails.send({
            from: 'DominioTotal <noreply@resend.dev>',
            to: [to],
            subject: `Nuevo Lead: ${leadData.propertyTitle}`,
            html: `
                <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                    <div style="background: linear-gradient(135deg, #0a4ecd 0%, #1e40af 100%); padding: 32px 24px; border-radius: 12px 12px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">Nuevo Lead Recibido</h1>
                        <p style="color: #93c5fd; margin: 8px 0 0; font-size: 14px;">DominioTotal - Plataforma Inmobiliaria</p>
                    </div>

                    <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                        <p style="font-size: 16px; color: #334155; margin-bottom: 16px;">
                            Alguien está interesado en tu propiedad <strong style="color: #0a4ecd;">${leadData.propertyTitle}</strong>
                            ${priceDisplay ? `<span style="color: #64748b;"> (${priceDisplay})</span>` : ''}.
                        </p>

                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0a4ecd;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px; font-weight: 600;">Nombre</td><td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${leadData.leadName}</td></tr>
                                <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px; font-weight: 600;">Email</td><td style="padding: 6px 0;"><a href="mailto:${leadData.leadEmail}" style="color: #0a4ecd;">${leadData.leadEmail}</a></td></tr>
                                ${leadData.leadPhone ? `<tr><td style="padding: 6px 0; color: #64748b; font-size: 13px; font-weight: 600;">Teléfono</td><td style="padding: 6px 0;"><a href="tel:${leadData.leadPhone}" style="color: #0a4ecd;">${leadData.leadPhone}</a></td></tr>` : ''}
                            </table>
                        </div>

                        <div style="background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0;">
                            <p style="margin: 0 0 8px; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Mensaje</p>
                            <p style="font-style: italic; color: #334155; margin: 0; line-height: 1.6;">"${leadData.leadMessage}"</p>
                        </div>

                        <div style="margin-top: 24px; text-align: center;">
                            ${leadData.leadPhone ? `<a href="https://wa.me/${leadData.leadPhone.replace(/\D/g, '')}?text=Hola ${leadData.leadName}, vi tu consulta por ${leadData.propertyTitle} en DominioTotal." style="background-color: #25d366; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 700; font-size: 14px; margin-right: 8px;">Responder por WhatsApp</a>` : ''}
                            <a href="https://dominiototal.vercel.app/my-properties/leads" style="background-color: #0a4ecd; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 700; font-size: 14px;">Ver en Dashboard</a>
                        </div>

                        <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center;">
                            Responder rápido aumenta tu tasa de conversión. Objetivo: responder en menos de 2 horas.
                        </p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error("Resend API Error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
    }
}
