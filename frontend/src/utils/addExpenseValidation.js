export const validateAddExpense = (data) => {
  const { year, month, day, amount, paymentMode } = data;

  if (!year.trim()) return { field: "year", message: "Please select year" };
  if (!month.trim()) return { field: "month", message: "Please select month" };
  if (!day.trim()) return { field: "day", message: "Please select day" };

  if (!amount) return { field: "amount", message: "Please enter amount" };

  if (!paymentMode.trim())
    return { field: "paymentMode", message: "Payment Mode is required" };

  return null;
};
