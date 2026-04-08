import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditExpense from "./EditExpense";

const ExpensesTable = ({ expenses, totalExpense }) => {
  const [isEditExpense, setIsEditExpense] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const navigate = useNavigate();

  const handleSendDataToEdit = (data) => {
    console.log(data);

    navigate("/edit-expense", {
      state: { data },
    });
  };
  return (
    <>
      <div className="w-full h-full rounded-2xl overflow-hidden bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm text-left">
            {/* Header */}
            <thead className="sticky top-0 left-0 bg-blue-50 border-b border-b-gray-200">
              <tr className="text-gray-600 uppercase tracking-wider text-center">
                <th className="text-base px-6 py-4 border-r border-r-gray-200">
                  #
                </th>
                <th className="text-base px-6 py-4 border-r border-r-gray-200">
                  Year
                </th>
                <th className="text-base px-6 py-4 border-r border-r-gray-200">
                  Month
                </th>
                <th className="text-base px-6 py-4 border-r border-r-gray-200">
                  Day
                </th>
                <th className="text-base px-6 py-4 border-r border-r-gray-200">
                  Category
                </th>
                <th className="text-base px-6 py-4 border-r border-r-gray-200">
                  Description
                </th>
                <th className="text-base px-6 py-4 border-r border-r-gray-200">
                  Amount
                </th>
                <th className="text-base px-6 py-4 border-r border-r-gray-200">
                  Payment
                </th>
                <th className="text-base px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {expenses.map((item, index) => {
                return (
                  <tr
                    className="hover:bg-gray-50 transition text-center border-b border-b-gray-200"
                    key={index}
                  >
                    <td className="text-base px-6 py-4 font-medium text-gray-700 border-r border-r-gray-200">
                      {index + 1}
                    </td>
                    <td className="text-base px-6 py-4 border-r border-r-gray-200">
                      {item.year}
                    </td>
                    <td className="text-base px-6 py-4 border-r border-r-gray-200">
                      {item.month}
                    </td>
                    <td className="text-base px-6 py-4 border-r border-r-gray-200">
                      {item.day}
                    </td>

                    <td className="px-6 py-4 border-r border-r-gray-200">
                      <span className="px-3 py-1 text-base text-nowrap font-medium bg-budget-buddy-100 text-budget-buddy-700 rounded-full">
                        {item.category}
                      </span>
                    </td>

                    <td className="text-base text-nowrap px-6 py-4 border-r border-r-gray-200 text-gray-600">
                      {item.description}
                    </td>

                    <td className="text-base px-6 py-4 border-r border-r-gray-200 font-semibold text-green-600">
                      ₹{item.amount}
                    </td>

                    <td className="px-6 py-4 border-r border-r-gray-200">
                      <span className="px-3 py-1 text-base font-medium bg-purple-100 text-purple-700 rounded-full">
                        {item.paymentMode}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="px-3 py-1 text-budget-buddy-700 text-base bg-budget-buddy-100 hover:bg-budget-buddy-200 rounded-lg transition-all ease-in-out cursor-pointer"
                          onClick={() => {
                            setIsEditExpense(true);
                            setExpenseToEdit(item);
                          }}
                        >
                          Edit
                        </button>
                        <button className="px-3 py-1 text-base bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all ease-in-out cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Footer */}
          </table>
        </div>
        <div className="w-full bg-blue-50 border-t border-t-gray-200">
          <div className="text-center font-semibold flex">
            <h1 className="px-6 py-4 text-xl text-gray-700">Total Expense</h1>

            <h1 className="px-6 py-4 text-green-600 text-xl font-bold">
              ₹{totalExpense}
            </h1>
          </div>
        </div>
      </div>
      {isEditExpense ? (
        <EditExpense
          editExpense={expenseToEdit}
          setIsEditExpense={setIsEditExpense}
        />
      ) : null}
    </>
  );
};

export default ExpensesTable;
