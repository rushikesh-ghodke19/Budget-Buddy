import cloudinary from "../config/cloudinary.js";
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

export const uploadUserImage = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log(req.file);

    const imageUrl = req.file.path;

    const user = await userModel.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 Delete old image (optional but recommended)
    // if (user.profileImage) {
    //   const publicId = user.profileImage.split("/").pop().split(".")[0];
    //   await cloudinary.uploader.destroy(`profile_images/${publicId}`);
    // }

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Uploaded",
      image: imageUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

export const deleteUserImage = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId Missing",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profileImage) {
      // ✅ Correct public_id extraction
      const urlParts = user.profileImage.split("/");
      const fileName = urlParts[urlParts.length - 1]; // abc.jpg
      const publicId = `profile_images/${fileName.split(".")[0]}`;

      console.log("Deleting:", publicId);

      await cloudinary.uploader.destroy(publicId);
    }

    // ✅ Remove from DB
    user.profileImage = null;
    await user.save();

    res.json({
      success: true,
      message: "Your image deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
