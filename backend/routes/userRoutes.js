import express from "express";
import {
  deleteUserImage,
  getUserData,
  uploadUserImage,
} from "../controllers/userController.js";
import { upload } from "../middleware/uploadImage.js";

const userRouter = express.Router();

userRouter.post("/userdata", getUserData);
userRouter.post("/upload-user-image", upload.single("image"), uploadUserImage);
userRouter.post("/delete-user-image", deleteUserImage);

export default userRouter;
