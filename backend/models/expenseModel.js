import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  year: { type: String, required: true },
  month: { type: String, required: true },
  day: { type: Number, required: true },
  category: { type: String },
  description: { type: String },
  amount: { type: Number, required: true },
  paymentMode: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const expenseModel = mongoose.model("expenses", expenseSchema);

export default expenseModel;  
