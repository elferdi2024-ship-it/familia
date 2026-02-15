import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLeadEmail(to: string, leadData: any) {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is missing");
        return { success: false, error: "Configuration error" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'DominioTotal <noreply@resend.dev>', // Use resend.dev for testing without domain
            to: [to], // In free tier, can only send to account email. For prod, verify domain.
            subject: `Nuevo Lead por: ${leadData.propertyTitle}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #0f172a;">Nuevo Lead Recibido 🏠</h1>
                    <p style="font-size: 16px; color: #334155;">Hola,</p>
                    <p style="font-size: 16px; color: #334155;">Tienes un nuevo interesado en la propiedad <strong>${leadData.propertyTitle}</strong>.</p>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Nombre:</strong> ${leadData.leadName}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${leadData.email || leadData.leadEmail}</p>
                        <p style="margin: 5px 0;"><strong>Mensaje:</strong></p>
                        <p style="font-style: italic; background: #fff; padding: 10px; border-radius: 4px;">"${leadData.leadMessage}"</p>
                    </div>

                    <a href="https://dominiototal.vercel.app/my-properties" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Ver en Dashboard</a>
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
