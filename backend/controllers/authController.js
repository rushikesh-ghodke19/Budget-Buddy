import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { sendVerificationOtp, generateOTP } from "../config/sendEmail.js";
import axios from "axios";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

//? User SignUp Controller

export const userSignUp = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const EXPIRY_MINUTES = 5;

  if (!firstname || !lastname || !email || !password) {
    console.log("Missing details");
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingEmail = await userModel.findOne({ email });

    if (existingEmail) {
      console.log("Email already exits");
      return res.json({
        success: false,
        message: "Email already exits. Try another",
      });
    }

    const otp = generateOTP();
    const expireAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpireAt: expireAt,
    });

    await user.save();

    try {
      await sendVerificationOtp(
        email,
        "Account Verification OTP",
        `Your verification OTP is ${otp}. Verify your account using this OTP. It will expire in ${EXPIRY_MINUTES} minutes.`,
      );
    } catch (error) {
      console.log("Error sending otp.");
      return res.json({ success: false, message: "Error sending otp" });
    }

    console.log("SignUp Successful:\n" + user);
    return res.json({
      success: true,
      message: "SignUp Successful! Otp sent to your email.",
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//? User SignIn Controller

export const userSignIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Email and Password are required");
    return res.json({
      success: false,
      message: "Email and Password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("Invalid email");
      return res.json({ success: false, message: "Invalid email" });
    }
    if (!user.isAccountVerified) {
      console.log("Your account is not verified");
      return res.json({
        success: false,
        message: "Your account is not verified",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.log("Invalid password");
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: "Signin successful!",
      userData: user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//? User Email Verification Controller

export const userOtpVerification = async (req, res) => {
  const { userOtp, userId } = req.body;

  if (!userOtp) {
    console.log("Missing userOtp");
    return res.json({ success: false, message: "Missing details" });
  }
  if (!userId) {
    console.log("Missing userId");
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || userOtp !== user.verifyOtp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      console.log("Otp Expired");
      user.verifyOtp = "";
      user.verifyOtpExpireAt = 0;
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    const token = generateToken(user._id);
    return res.json({
      success: true,
      message: "Your account is verified successful",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//? Send Reset Password OTP Controller

export const sendResetPasswordOtp = async (req, res) => {
  const { email } = req.body;
  const EXPIRY_MINUTES = 5;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("Invalid email");
      return res.json({ success: false, message: "Invalid email" });
    }
    if (!user.isAccountVerified) {
      console.log("Your account is not verified");
      return res.json({
        success: false,
        message: "Your account is not verified",
      });
    }

    const otp = generateOTP();
    const expireAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = expireAt;

    await user.save();

    try {
      await sendVerificationOtp(
        email,
        "Password Reset OTP",
        `Your verification OTP is ${otp}. Verify your account using this OTP. It will expire in ${EXPIRY_MINUTES} minutes.`,
      );
      console.log("Email sent successfully");
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: error.message });
    }

    res.json({
      success: true,
      message: "Otp sent successfully",
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//? Reset Password Controller

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    console.log("Missing " + email || newPassword);
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.json({ success: false, message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(newPassword, user.password);
    if (isPasswordMatch) {
      return res.json({
        success: false,
        message: "Password cannot be same as previous.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Your password has been reset successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
