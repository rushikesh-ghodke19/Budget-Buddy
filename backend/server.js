import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import expenseRouter from "./routes/expenseRoutes.js";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(
  cors({
    origin: "https://budget-buddy-phfp.onrender.com",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use("/api/expenses", expenseRouter);

app.get("/test", (req, res) => {
  res.json({ message: "Server working" });
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
