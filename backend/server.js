import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import expenseRouter from "./routes/expenseRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(cors({ credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use("/api/expenses", expenseRouter);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
