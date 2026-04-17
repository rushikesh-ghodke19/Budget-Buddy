import { useEffect, useRef, useState } from "react";
import Dropdown from "../components/Dropdown";
import useApi from "../hooks/useApi";
import useToast from "../hooks/useToast";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import ExpensesTable from "../components/ExpensesTable";
import Loading from "../components/Loading";

const ViewExpenses = () => {
  const date = new Date();
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    date.toLocaleString("en-us", { month: "long" }),
  );
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const { callApi, loading } = useApi();
  const { showError, showWarning, showSuccess } = useToast();

  const wrapperRef = useRef(null);

  const years = Array.from({ length: 5 }, (_, i) => 2026 + i);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewExpenses = async () => {
    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.EXPENSE.VIEWEXPENSE}`,
      { year: selectedYear, month: selectedMonth, userId },
    );

    if (error) {
      console.log(error);
      showError("Error", error.message);
    }

    if (!data) return;

    if (!data.success) {
      return showWarning("Warning", data.message);
    } else {
      setExpenses(data?.expenses);
    }
  };
  const totalExpense = expenses.reduce(
    (acc, currElem) => acc + currElem.amount,
    0,
  );

  useEffect(() => {
    handleViewExpenses();
  }, [selectedYear, selectedMonth]);
  return (
    <div className="w-full h-full min-h-0 flex flex-col">
      <div className="w-full flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="border-b border-b-gray-200">
          <h1 className="text-3xl font-semibold tracking-wide pb-4">
            Monthly Expenses
          </h1>
        </div>

        {/* Tabs */}
        <div
          className="w-full py-6 flex flex-col gap-3 border-b border-b-gray-200"
          ref={wrapperRef}
        >
          <div className="w-full flex flex-col md:flex-row md:justify-between items-start gap-4">
            <div className="w-full flex flex-col gap-2">
              <h1 className="text-2xl font-medium tracking-wide">
                Select Month
              </h1>
              <ul className="w-full flex items-center gap-4 overflow-x-auto">
                {months.map((item, index) => {
                  return (
                    <li key={index}>
                      <button
                        className={`px-3 py-3 border border-gray-300 rounded-2xl text-[1.1rem] text-black tracking-wider hover:bg-budget-buddy-100 transition-all ease-in-out cursor-pointer ${
                          selectedMonth === item ? "bg-budget-buddy-100" : ""
                        }`}
                        onClick={() => {
                          setSelectedMonth(item);
                        }}
                      >
                        {item}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="sm:w-90 w-full flex flex-col items-end gap-2">
              <h1 className="text-2xl self-start font-medium tracking-wide">
                Select Year
              </h1>
              <div className="sm:w-auto w-full">
                <Dropdown
                  width="sm:w-90 w-full"
                  label="Year"
                  data={years}
                  selected={selectedYear}
                  setSelected={setSelectedYear}
                  type="year"
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Expenses */}
        {loading ? (
          <div className="mt-6 flex justify-center items-center">
            <Loading w="w-14" h="h-14" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="w-full mt-6 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-2xl bg-white py-16 px-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="w-28 h-28 flex items-center justify-center rounded-full bg-budget-buddy-100 text-budget-buddy-600 text-6xl mb-6">
              💸
            </div>

            <h2 className="text-3xl font-semibold text-gray-800">
              No Expenses Found
            </h2>

            <p className="mt-2 text-gray-600 text-xl">
              You don’t have any expenses for{" "}
              <span className="font-semibold text-gray-700">
                {selectedMonth}
              </span>{" "}
              {selectedYear}.
            </p>

            <p className="mt-1 text-gray-500 text-lg">
              Start tracking your spending by adding a new expense.
            </p>

            <button
              className="mt-6 px-6 py-3 rounded-xl bg-budget-buddy-600 text-xl text-white hover:bg-budget-buddy-700 transition cursor-pointer"
              onClick={() => navigate("/profile/add-expense")}
            >
              + Add Expense
            </button>
          </div>
        ) : (
          <div className="flex-1 min-h-0 mt-6">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow flex flex-col">
              <ExpensesTable
                expenses={expenses}
                totalExpense={totalExpense}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExpenses;
