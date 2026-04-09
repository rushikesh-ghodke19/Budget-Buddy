import express from "express";
import { addExpense, deleteExpense, editExpense, getStats, viewExpenses } from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/add-expense", addExpense);
expenseRouter.post("/view-expenses", viewExpenses);
expenseRouter.post("/get-stats", getStats);
expenseRouter.post("/edit-expense", editExpense);
expenseRouter.post("/delete-expense", deleteExpense);

export default expenseRouter;