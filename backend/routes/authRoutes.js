import express from "express";
import {
  resendOtp,
  resetPassword,
  sendResetPasswordOtp,
  userOtpVerification,
  userSignIn,
  userSignUp,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/signup", userSignUp);
authRouter.post("/signin", userSignIn);
authRouter.post("/otp-verification", userOtpVerification);
authRouter.post("/send-resetpassword-otp", sendResetPasswordOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/resend-otp", resendOtp);

authRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    console.log("Profile route hit");
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default authRouter;
