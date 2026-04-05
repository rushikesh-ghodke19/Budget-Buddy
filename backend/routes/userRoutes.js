import express from "express";
import { getUserData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/userdata", getUserData);

export default userRouter;
