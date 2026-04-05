import express from "express";
import { addExpense, getStats, viewExpenses } from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/add-expense", addExpense);
expenseRouter.post("/view-expenses", viewExpenses);
expenseRouter.post("/get-stats", getStats);

export default expenseRouter;