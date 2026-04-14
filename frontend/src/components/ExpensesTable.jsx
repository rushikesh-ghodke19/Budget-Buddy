import { useState } from "react";
import { useLocation } from "react-router-dom";
import EditExpense from "./EditExpense";
import DeleteExpense from "./DeleteExpense";
import useApi from "../hooks/useApi";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import useToast from "../hooks/useToast";
import axios from "axios";
import Loading from "./Loading";

const ExpensesTable = ({
  expenses,
  totalExpense,
  selectedMonth,
  selectedYear,
}) => {
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [isEditExpense, setIsEditExpense] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const [isDeleteExpense, setIsDeleteExpense] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const location = useLocation();

  const { showError, showSuccess } = useToast();

  const handleDownloadReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}${API_PATHS.EXPENSE.DOWNLOADREPORT}`,
        {
          month: selectedMonth,
          year: selectedYear,
          userId,
        },
        {
          responseType: "blob", // ✅ VERY IMPORTANT
        },
      );

      // ✅ Create downloadable file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Expense_Report_${selectedMonth}_${selectedYear}.xlsx`,
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      showSuccess(
        "Success",
        `Report for ${selectedMonth} ${selectedYear} downloaded successfully`,
      );
    } catch (error) {
      console.error("ERROR:", error);
      showError("Download Failed", "Something went wrong");
      setLoading(false);
    } finally {
      setLoading(false);
    }
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
                        {item.category ? item.category : "-"}
                      </span>
                    </td>

                    <td className="text-base text-nowrap px-6 py-4 border-r border-r-gray-200 text-gray-600">
                      {item.description ? item.description : "-"}
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
                        <button
                          className="px-3 py-1 text-base bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all ease-in-out cursor-pointer"
                          onClick={() => {
                            setIsDeleteExpense(true);
                            setExpenseToDelete(item);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="w-full bg-blue-50 flex justify-between items-center px-6 py-4">
          <div className="text-center font-semibold flex gap-8">
            <h1 className="text-xl text-gray-700">Total Expense</h1>

            <h1 className="text-green-600 text-xl font-bold">
              ₹{totalExpense}
            </h1>
          </div>

          {location.pathname === "/view-expenses" ? (
            <div>
              <button
                type="button"
                className="sm:px-6 px-4 sm:py-4 py-3 text-white text-lg font-semibold tracking-wide bg-budget-buddy-700 rounded-2xl hover:bg-budget-buddy-600 cursor-pointer transition-all ease-in-out"
                onClick={handleDownloadReport}
              >
                {loading ? (
                  <div className="flex items-center gap-4">
                    <Loading w="w-3     " h="h-3" />
                    Downloading
                  </div>
                ) : (
                  "Download"
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      {isEditExpense ? (
        <EditExpense
          editExpense={expenseToEdit}
          setIsEditExpense={setIsEditExpense}
        />
      ) : null}
      {isDeleteExpense ? (
        <DeleteExpense
          deleteExpense={expenseToDelete}
          setIsDeleteExpense={setIsDeleteExpense}
        />
      ) : null}
    </>
  );
};

export default ExpensesTable;
