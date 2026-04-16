import expenseModel from "../models/expenseModel.js";
import userModel from "../models/userModel.js";
import exceljs from "exceljs";

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

    const recentExpenses = sortedExpenses.slice(0, 10);

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

//? Edit Expense

export const editExpense = async (req, res) => {
  const {
    expenseId,
    year,
    month,
    day,
    category,
    description,
    amount,
    paymentMode,
  } = req.body;

  try {
    const expense = await expenseModel.findById(expenseId);

    if (!expense) {
      return res.json({ success: false, message: "Expense not found" });
    }

    expense.year = year;
    expense.month = month;
    expense.day = day;
    expense.category = category;
    expense.description = description;
    expense.amount = amount;
    expense.paymentMode = paymentMode;

    await expense.save();

    return res.json({ success: true, message: "Expense edited successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//? Delete Expense

export const deleteExpense = async (req, res) => {
  const { expenseId } = req.body;

  if (!expenseId)
    return res.json({ success: false, message: "Expense Id Missing" });

  try {
    const expense = await expenseModel.findById(expenseId);

    if (!expense)
      return res.json({ success: false, message: "Expense not found" });

    const deleteExpense = await expenseModel.deleteOne({ _id: expenseId });

    if (!deleteExpense)
      return res.json({ success: false, message: "Expense not deleted" });

    res.json({
      success: true,
      message: "Expense deleted successfully",
      deletedExpense: deleteExpense,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//? Download Expenses in Excel File

export const downloadExpenseReport = async (req, res) => {
  const { month, year, userId } = req.body;

  if (!month || !year) {
    console.log("Month or Year is Missing");
    return res.json({ success: false, message: "Missing month or year" });
  }

  try {
    const expenses = await expenseModel.find({ month, year, user_id: userId });

    if (expenses.length === 0) {
      console.log(`There are no expenses for ${month} and ${year}`);
      res.json({
        success: false,
        message: `There are no expenses for ${month} and ${year}`,
      });
      return;
    }

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet(`${month}`);

    worksheet.columns = [
      { header: "Sr.No.", key: "srno", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Category", key: "category", width: 40 },
      { header: "Description", key: "description", width: 70 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Payment Mode", key: "paymentMode", width: 15 },
    ];

    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    expenses.forEach((expense, index) => {
      const formattedDate = new Date(
        Number(expense.year),
        monthMap[expense.month],
        Number(expense.day),
      ).toLocaleDateString("en-IN");

      worksheet.addRow({
        srno: index + 1,
        date: formattedDate,
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        paymentMode: expense.paymentMode,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename=${month}.xlsx`);

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error generating report: " + error.message);
  }
};
