import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationOTP = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    return info; // success response
  } catch (error) {
    throw error; // let caller handle error
  }
};

export const generateOTP = () => {
  let otp = "";

  for (let i = 1; i <= 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};
