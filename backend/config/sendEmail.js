import { Resend } from "resend";

// Initialize Resend with your API Key from Render Environment Variables
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationOtp = async (email, subject, message) => {
  try {
    const data = await resend.emails.send({
      from: process.env.SMTP_USER, // Use this for testing; verify your domain later for a custom email
      to: email,
      subject: subject,
      text: message,
    });
    return data;
  } catch (error) {
    console.error("Resend Error:", error);
    throw error;
  }
};

export const generateOTP = () => {
  let otp = "";

  for (let i = 1; i <= 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};
