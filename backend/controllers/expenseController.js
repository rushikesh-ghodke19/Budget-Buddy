import expenseModel from "../models/expenseModel.js";
import userModel from "../models/userModel.js";
import expenseRouter from "../routes/expenseRoutes.js";

//? Add Expense
export const addExpense = async (req, res) => {
  const {
    year,
    month,
    day,
    category,
    description,
    amount,
    paymentMode,
    userId,
  } = req.body;

  console.log(
    year,
    month,
    day,
    category,
    description,
    amount,
    paymentMode,
    userId,
  );

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const expense = new expenseModel({
      year,
      month,
      day,
      category,
      description,
      amount,
      paymentMode,
      user_id: userId,
    });

    await expense.save();
    return res.json({ success: true, message: "Expense added successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to add expense" });
  }
};

//? View Expenses
export const viewExpenses = async (req, res) => {
  const { year, month, userId } = req.body;

  if (!year || !month || !userId) {
    console.log(year, month, userId);
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const expenses = await expenseModel
      .find({
        year,
        month,
        user_id: userId,
      })
      .sort({ day: 1 });

    if (!expenses) {
      return res.json({ success: false, message: "No expenses found" });
    }

    res.json({
      success: true,
      message: "Expenses found",
      expenses,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

//? Get Stats
export const getStats = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId Missing");
    return res.json({ success: false, message: "UserId Missing" });
  }

  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });

  const currentDay = now.getDate();

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      console.log("User not found");
      return res.json({ success: false, message: "User not found" });
    }

    const allExpenses = await expenseModel.find({ user_id: userId });
    const currentMonthExpenses = await expenseModel.find({
      user_id: userId,
      month: currentMonth,
    });
    const currentDayExpenses = await expenseModel.find({
      user_id: userId,
      month: currentMonth,
      day: currentDay,
    });
    const expenses = await expenseModel.find({ user_id: userId });

    const monthMap = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const sortedExpenses = expenses.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      if (monthMap[a.month] !== monthMap[b.month])
        return monthMap[b.month] - monthMap[a.month];
      return b.day - a.day;
    });

    const recentExpenses = sortedExpenses.slice(0, 5);

    const totalExpenses = allExpenses.reduce(
      (acc, curElem) => acc + curElem.amount,
      0,
    );
    const thisMonthExpenses = currentMonthExpenses.reduce(
      (acc, curElem) => acc + curElem.amount,
      0,
    );
    const todayExpenses = currentDayExpenses.reduce(
      (acc, curElem) => acc + curElem.amount,
      0,
    );

    return res.json({
      success: true,
      message: "All expenses fetched",
      totalExpenses,
      thisMonthExpenses,
      todayExpenses,
      recentExpenses,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
