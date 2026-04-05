import nodemailer from "nodemailer";

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationOtp = (email, subject, message) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: subject,
    text: message,
  };
  return transpoter.sendMail(mailOptions);
};

export const generateOTP = () => {
  let otp = "";

  for (let i = 1; i <= 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};
