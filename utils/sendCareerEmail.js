import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendCareerEmail = async (data) => {
  try {
    if (!data.firstName || !data.email || !data.jobTitle) {
      throw new Error("Missing required career fields");
    }

    // ==========================================
    // 1. HR NOTIFICATION
    // ==========================================

    const hrEmail = await resend.emails.send({
      from: "LAX360 Careers <onboarding@resend.dev>",

      to: [process.env.HR_EMAIL || process.env.CONTACT_EMAIL],

      replyTo: data.email,

      subject: "📧 New Job Application - LAX360",

      html: `
        <div style="font-family: Arial; padding: 20px;">

          <h2>New Job Application Received</h2>

          <p>
            <strong>First Name:</strong>
            ${data.firstName}
          </p>

          <p>
            <strong>Last Name:</strong>
            ${data.lastName || "Not provided"}
          </p>

          <p>
            <strong>Email:</strong>
            ${data.email}
          </p>

          <p>
            <strong>Phone:</strong>
            ${data.phone || "Not provided"}
          </p>

          <p>
            <strong>Job Title:</strong>
            ${data.jobTitle}
          </p>

          <p>
            <strong>Address:</strong>
            ${data.address || "Not provided"}
          </p>

          <p>
            <strong>City:</strong>
            ${data.city || "Not provided"}
          </p>

          <p>
            <strong>State:</strong>
            ${data.state || "Not provided"}
          </p>

          <p>
            <strong>Postal Code:</strong>
            ${data.zip || "Not provided"}
          </p>

          ${
            data.resume
              ? `
                <p>
                  <a
                    href="${data.resume}"
                    target="_blank"
                    style="
                      display:inline-block;
                      padding:10px 20px;
                      background:#667eea;
                      color:white;
                      text-decoration:none;
                      border-radius:5px;
                    "
                  >
                    📄 Open Resume
                  </a>
                </p>
              `
              : ""
          }

        </div>
      `,
    });

    console.log(
      "✅ Career HR email sent:",
      hrEmail.data?.id
    );

    // ==========================================
    // 2. APPLICANT AUTO REPLY
    // ==========================================

    const applicantEmail = await resend.emails.send({
      from: "LAX360 <onboarding@resend.dev>",

      to: [data.email],

      subject: "Application Received - LAX360",

      html: `
        <div style="font-family: Arial; padding: 20px;">

          <h2>Thank you for applying at LAX360</h2>

          <p>
            Hi ${data.firstName},
          </p>

          <p>
            We have received your application for the
            <strong>${data.jobTitle}</strong>
            position.
          </p>

          <p>
            Our HR team will review your profile shortly.
          </p>

          <p>
            Regards,<br>
            LAX360 Hiring Team
          </p>

        </div>
      `,
    });

    console.log(
      "✅ Career auto-reply sent:",
      applicantEmail.data?.id
    );

    return {
      success: true,
      hrEmail: hrEmail.data,
      applicantEmail: applicantEmail.data,
    };

  } catch (error) {

    console.error(
      "❌ Career email error:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};