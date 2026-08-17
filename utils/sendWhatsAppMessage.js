import axios from "axios";

const normalizePhone = (value) => {
  if (!value) return "";
  return String(value).replace(/[^\d]/g, "");
};

export const sendWhatsAppMessage = async (payload) => {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const configuredRecipient = process.env.WHATSAPP_TO_NUMBER || "917667905565";
    const recipientPhone = normalizePhone(configuredRecipient);

    if (!accessToken || !phoneNumberId || !recipientPhone) {
      console.warn("WhatsApp not configured. Skipping message.");
      return { success: false, skipped: true };
    }

    const apiUrl = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
    const textBody = [
      "New contact enquiry from LAX360 website:",
      `Name: ${payload.Name || "N/A"}`,
      `Email: ${payload.email || "N/A"}`,
      `Phone: ${payload.phone || "N/A"}`,
      `Service: ${payload.service || "N/A"}`,
      `Message: ${payload.message || "N/A"}`,
    ].join("\n");

    await axios.post(
      apiUrl,
      {
        messaging_product: "whatsapp",
        to: recipientPhone,
        type: "text",
        text: { body: textBody },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );

    console.log("WhatsApp notification sent");
    return { success: true };
  } catch (error) {
    const details = error?.response?.data || error.message;
    console.error("WhatsApp notification failed:", details);
    return { success: false, error: String(details) };
  }
};
