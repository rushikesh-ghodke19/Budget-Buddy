import { useContext, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { Data } from "../context/DataProvider";
import KPICard from "../components/KPICard";
import ExpensesTable from "../components/ExpensesTable";

const Home = () => {
  const { user } = useContext(Data);
  const userId = localStorage.getItem("userId");
  const [greetings, setGreetings] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [thisMonthExpenses, setThisMonthExpenses] = useState(0);
  const [todayExpenses, setTodayExpenses] = useState(0);
  const [recentExpenses, setRecentExpenes] = useState(null);

  const hour = new Date().getHours();

  const { callApi } = useApi();

  const handleGetStats = async () => {
    const { data, error } = await callApi(
      "post",
      `http://localhost:8080/api/expenses/get-stats`,
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
        <KPICard title="Total Expenses" value={totalExpenses} />
        <KPICard title="This Month" value={thisMonthExpenses} />
        <KPICard title="Today" value={todayExpenses} />
      </div>

      {/* Recent Expenses */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">
        Recent Expenses
      </h2>
      <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        {!recentExpenses ? (
          <p className="text-gray-500 text-sm">No recent expenses</p>
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
