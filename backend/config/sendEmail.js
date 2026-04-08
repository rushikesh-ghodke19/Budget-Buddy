import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

// ✅ Initialize MailerSend
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

// ✅ Send OTP Email
export const sendVerificationOTP = async (email, subject, message) => {
  try {
    const sentFrom = new Sender(
      "budget-buddy@test-zkq340erk20gd796.mlsender.net", // ⚠️ MUST be verified in MailerSend
      "Budget Buddy",
    );

    const recipients = [new Recipient(email)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setText(message);

    const response = await mailerSend.email.send(emailParams);

    console.log("Email sent:", response.message);
    return response;
  } catch (error) {
    console.error("MailerSend error:", error?.body || error.message);
    throw new Error("Failed to send email");
  }
};

// ✅ OTP Generator
export const generateOTP = () => {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(
    "",
  );
};
