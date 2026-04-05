import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User Id not found" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User fetched successfully",
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
