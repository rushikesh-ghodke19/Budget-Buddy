import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import Input from "./Input";
import {
  CiCalendarDate,
  CiCreditCard1,
  CiDollar,
  CiFileOn,
  CiGrid42,
} from "react-icons/ci";
import Loading from "./Loading";
import useApi from "../hooks/useApi";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import useToast from "../hooks/useToast";
import { useNavigate } from "react-router-dom";

const EditExpense = ({ editExpense, setIsEditExpense }) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState(0);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const navigate = useNavigate();

  const date = new Date();
  let currentYear = date.getFullYear();
  let currentMonth = date.toLocaleString("en-us", { month: "long" });
  let currentDate = date.getDate();

  const { callApi, loading } = useApi();
  const { showWarning, showError, showSuccess } = useToast();

  const handleEditExpense = async () => {
    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.EXPENSE.EDITEXPENSE}`,
      {
        expenseId: editExpense._id,
        year,
        month,
        day,
        category,
        description,
        amount,
        paymentMode,
      },
    );

    if (error) {
      showError("SignUp Failed", error?.message || "Something went wrong.");
      console.error("ERROR:", error);
      return;
    }

    if (!data) return;

    if (!data.success) {
      showWarning("Warning", data.message);
      return;
    }

    showSuccess("Succes", data.message);
    setIsEditExpense(false);

    navigate(0);
  };

  useEffect(() => {
    if (editExpense) {
      setYear(editExpense.year || "");
      setMonth(editExpense.month || "");
      setDay(editExpense.day || "");
      setCategory(editExpense.category || "");
      setDescription(editExpense.description || "");
      setAmount(editExpense.amount || "");
      setPaymentMode(editExpense.paymentMode || "");
    }
  }, [editExpense]);
  return (
    <div className="fixed inset-0 bg-black/20 lg:px-96 md:px-48 sm:px-24 px-10 z-50 flex items-center justify-center">
      <div className="bg-white sm:max-w-7xl w-full rounded-2xl max-h-[90vh] overflow-y-auto shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <div className="w-full px-6 py-6 flex justify-between border-b border-b-gray-200">
          <h1 className="text-2xl text-gray-700 font-bold">Edit Expense</h1>
          <button
            className="w-16 h-16 flex items-center justify-center bg-budget-buddy-100 transition-all ease-in-out duration-300 rounded-2xl cursor-pointer"
            onClick={() => setIsEditExpense(false)}
          >
            <IoCloseOutline className="text-3xl" />
          </button>
        </div>
        {loading ? (
          <div className="w-full h-full flex justify-center items-center py-16 px-6">
            <Loading w="w-14" h="h-14" />
          </div>
        ) : (
          <div className="w-full bg-gray-50">
            <form autoComplete="off" className="w-full flex flex-col gap-6">
              <div className="w-full px-6 mt-6 flex flex-col gap-4">
                <h1 className="text-2xl text-budget-buddy-950 font-semibold tracking-wide">
                  Edit Date
                </h1>
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                  <Input
                    width="sm:w-124 w-full"
                    type="text"
                    placeholder={`Current Year "${currentYear}"`}
                    value={year}
                    name="Year"
                    onChange={(e) => setYear(e.target.value)}
                    icon={<CiCalendarDate />}
                    label="Year"
                  />
                  <Input
                    width="sm:w-124 w-full"
                    type="text"
                    placeholder={`Current Month "${currentMonth}"`}
                    value={month}
                    name="Month"
                    onChange={(e) => setMonth(e.target.value)}
                    icon={<CiCalendarDate />}
                    label="Month"
                  />
                  <Input
                    width="sm:w-124 w-full"
                    type="number"
                    placeholder={`Today's Date "${currentDate}"`}
                    value={day}
                    name="Date"
                    onChange={(e) => setDay(e.target.value)}
                    icon={<CiCalendarDate />}
                    label="Date"
                  />
                </div>
              </div>

              <div className="w-full px-6 flex flex-col gap-4">
                <h1 className="text-2xl font-semibold tracking-wide">
                  Edit Category & Description
                </h1>
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                  <Input
                    width="sm:w-124 w-full"
                    type="text"
                    placeholder="Category"
                    value={category}
                    name="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    icon={<CiGrid42 />}
                    label="Category"
                  />
                  <Input
                    width="sm:w-124 w-full"
                    type="text"
                    placeholder="Description"
                    value={description}
                    name="Description"
                    onChange={(e) => setDescription(e.target.value)}
                    icon={<CiFileOn />}
                    label="Description"
                  />
                </div>
              </div>

              <div className="w-full px-6 flex flex-col gap-4">
                <h1 className="text-2xl font-semibold tracking-wide">
                  Edit Amount & Payment Mode
                </h1>
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                  <Input
                    width="sm:w-124 w-full"
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    name="Amount"
                    onChange={(e) => setAmount(e.target.value)}
                    icon={<CiDollar />}
                    label="Amount"
                  />
                  <Input
                    width="sm:w-124 w-full"
                    type="text"
                    placeholder="Payment Mode"
                    value={paymentMode}
                    name="Payment Mode"
                    onChange={(e) => setPaymentMode(e.target.value)}
                    icon={<CiCreditCard1 />}
                    label="Payment Mode"
                  />
                </div>
              </div>

              <div className="w-full px-6 bg-white flex justify-end border-t border-t-gray-200">
                <button
                  type="button"
                  className="px-8 py-5 my-6 bg-budget-buddy-400/20 rounded-2xl text-budget-buddy-600 hover:text-white text-xl tracking-wide hover:bg-budget-buddy-600 transition-all ease-in-out cursor-pointer"
                  onClick={handleEditExpense}
                >
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <Loading w="w-8" h="h-8" />
                      Editing Expense
                    </div>
                  ) : (
                    "Edit Expense"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditExpense;
