import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../components/Dropdown";
import useApi from "../hooks/useApi";
import useToast from "../hooks/useToast";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import ExpensesTable from "../components/ExpensesTable";
import Loading from "../components/Loading";

const ViewExpenses = () => {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("January");
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
    <div className="w-full h-screen pt-36 pb-12 overflow-hidden flex flex-col">
      <div className="w-full h-full lg:px-60 md:px-36 sm:px-32 px-10 flex flex-col">
        {/* Header */}
        <div className="py-4 border-b border-b-gray-200">
          <h1 className="text-3xl font-semibold tracking-wide">
            Monthly Expenses
          </h1>
        </div>

        {/* Tabs */}
        <div
          className="w-full py-6 flex flex-col gap-3 border-b border-b-gray-200"
          ref={wrapperRef}
        >
          <h1 className="text-2xl font-medium tracking-wide">Select Month</h1>
          <div className="w-full flex flex-col md:flex-row items-start gap-4">
            <ul className="w-full flex items-center gap-4 overflow-x-auto">
              {months.map((item, index) => {
                return (
                  <li key={index}>
                    <button
                      className={`px-5 py-4 border border-gray-300 rounded-2xl text-[1.1rem] text-black tracking-wider hover:bg-gray-200 transition-all ease-in-out cursor-pointer ${
                        selectedMonth === item ? "bg-gray-200" : ""
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

        {/* Expenses */}
        {loading ? (
          <div className="w-full mt-6 flex flex-col items-center justify-center border border-gray-300 rounded-2xl bg-white py-16 px-6 text-center">
            <Loading w="w-14" h="h-14" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="w-full mt-6 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-2xl bg-white py-16 px-6 text-center">
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
              onClick={() => navigate("/")}
            >
              + Add Expense
            </button>
          </div>
        ) : (
          <div className="relative w-full mt-6 border border-gray-200 rounded-2xl overflow-hidden bg-white flex-1">
            <ExpensesTable expenses={expenses} totalExpense={totalExpense} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExpenses;
