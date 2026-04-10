import { useContext, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { Data } from "../context/DataProvider";
import KPICard from "../components/KPICard";
import ExpensesTable from "../components/ExpensesTable";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(Data);
  const userId = localStorage.getItem("userId");
  const [greetings, setGreetings] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [thisMonthExpenses, setThisMonthExpenses] = useState(0);
  const [todayExpenses, setTodayExpenses] = useState(0);
  const [recentExpenses, setRecentExpenes] = useState([]);

  const navigate = useNavigate();

  const hour = new Date().getHours();

  const { callApi, loading } = useApi();

  const handleGetStats = async () => {
    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.EXPENSE.GETSTATS}`,
      { userId },
    );

    if (error) {
      console.log(error);
      return alert(error.message);
    }

    if (!data) return;

    if (!data.success) {
      return aler(error.message);
    }

    setTotalExpenses(data?.totalExpenses);
    setThisMonthExpenses(data?.thisMonthExpenses);
    setTodayExpenses(data?.todayExpenses);
    setRecentExpenes(data?.recentExpenses);
  };

  const recentExpensesTotal = recentExpenses?.reduce(
    (acc, curElem) => acc + curElem.amount,
    0,
  );

  useEffect(() => {
    if (hour < 12) {
      setGreetings("Good Morning");
    } else if (hour < 18) {
      setGreetings("Good Afternoon");
    } else {
      setGreetings("Good Evening");
    }
  }, [hour]);

  useEffect(() => {
    if (userId) handleGetStats();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 lg:px-96 md:px-48 sm:px-24 px-12 pt-36">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="w-full py-4 border-b border-b-gray-200">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {greetings} {user?.firstname}, Welcome back 👋
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        <KPICard
          title="Total Expenses"
          value={totalExpenses}
          loading={loading}
        />
        <KPICard
          title="This Month"
          value={thisMonthExpenses}
          loading={loading}
        />
        <KPICard title="Today" value={todayExpenses} loading={loading} />
      </div>

      {/* Recent Expenses */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">
        Recent Expenses
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center  rounded-2xl bg-white py-16 px-6 text-center">
            <Loading w="w-14" h="h-14" />
          </div>
        ) : recentExpenses.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center rounded-2xl bg-white py-16 px-6 text-center">
            <div className="w-28 h-28 flex items-center justify-center rounded-full bg-budget-buddy-100 text-budget-buddy-600 text-6xl mb-6">
              💸
            </div>

            <h2 className="text-3xl font-semibold text-gray-800">
              No Recent Expenses Found
            </h2>

            <p className="mt-2 text-gray-600 text-xl">
              You don’t have any recent expenses yet.
            </p>

            <p className="mt-1 text-gray-500 text-lg">
              Start tracking your spending by adding a new expense.
            </p>

            <button
              className="mt-6 px-6 py-3 rounded-xl bg-budget-buddy-600 text-xl text-white hover:bg-budget-buddy-700 transition cursor-pointer"
              onClick={() => navigate("/add-expense")}
            >
              + Add Expense
            </button>
          </div>
        ) : (
          <div className="relative w-full">
            <ExpensesTable
              expenses={recentExpenses}
              totalExpense={recentExpensesTotal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
