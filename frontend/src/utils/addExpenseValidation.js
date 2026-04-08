export const validateAddExpense = (data) => {
  const { year, month, day, category, description, amount, paymentMode } = data;

  if (!year) return { field: "year", message: "Please select year" };
  if (!month) return { field: "month", message: "Please select month" };
  if (!day) return { field: "day", message: "Please select day" };

  // if (!category.trim())
  //   return { field: "category", message: "Category is required" };

  // if (!description.trim())
  //   return { field: "description", message: "Description is required" };

  if (!amount) return { field: "amount", message: "Please enter amount" };

  if (!paymentMode.trim())
    return { field: "paymentMode", message: "Payment Mode is required" };

  return null;
};
