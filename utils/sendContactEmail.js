import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async (data) => {
    console.log("\n📧 ===== EMAIL PROCESS STARTED =====");

    try {
        console.log("📧 RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
        console.log("📧 CONTACT_EMAIL:", process.env.CONTACT_EMAIL);

        if (!data.Name || !data.email || !data.message) {
            throw new Error("Missing required fields");
        }

        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is missing in .env");
        }

        if (!process.env.CONTACT_EMAIL) {
            throw new Error("CONTACT_EMAIL is missing in .env");
        }

        console.log("📧 Sending email via Resend...");

        const response = await resend.emails.send({
            from: "LAX360 <onboarding@resend.dev>",
            to: [process.env.CONTACT_EMAIL],
            replyTo: data.email,

            subject: "📩 New Contact Message - LAX360",

            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h2>New Contact Inquiry</h2>

                    <p><b>Name:</b> ${data.Name}</p>
                    <p><b>Email:</b> ${data.email}</p>
                    <p><b>Phone:</b> ${data.phone || "Not provided"}</p>
                    <p><b>Service:</b> ${data.service || "Not specified"}</p>
                    <p><b>Message:</b> ${data.message}</p>
                </div>
            `,
        });

        console.log("📧 Resend response:", response);

        if (response.error) {
            throw new Error(response.error.message);
        }

        console.log("✅ EMAIL SENT SUCCESSFULLY");
        console.log("📧 Email ID:", response.data?.id);
        console.log("📧 ===== EMAIL PROCESS END =====\n");

        return {
            success: true,
            data: response.data,
        };

    } catch (error) {

        console.error("❌ EMAIL FAILED");
        console.error("❌ Error:", error.message);
        console.error("❌ ===== EMAIL PROCESS END =====\n");

        return {
            success: false,
            error: error.message,
        };
    }
};