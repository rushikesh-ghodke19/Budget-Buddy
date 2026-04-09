import { IoCloseOutline } from "react-icons/io5";
import questionMark from "../assets/trash-bin.gif";
import useApi from "../hooks/useApi";
import Loading from "./Loading";
import Input from "./Input";
import { CiTrash } from "react-icons/ci";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import useToast from "../hooks/useToast";

const DeleteExpense = ({ deleteExpense, setIsDeleteExpense }) => {
  const [writeDelete, setWriteDelete] = useState("");
  const navigate = useNavigate();
  const { callApi, loading } = useApi();
  const { showWarning, showError, showSuccess } = useToast();

  const handleDeleteExpense = async () => {
    console.log("Deleted");

    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.EXPENSE.DELETEEXPENSE}`,
      {
        expenseId: deleteExpense._id,
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

    setIsDeleteExpense(false);
    navigate(0);
  };
  return (
    <div className="fixed inset-0 bg-black/20 lg:px-96 md:px-48 sm:px-24 px-12 z-50 flex items-center justify-center">
      <div className="sm:w-3xl w-full bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <div className="w-full px-6 py-6 flex justify-between border-b border-b-gray-200">
          <h1 className="text-2xl text-gray-700 font-semibold tracking-wide">
            Delete Expense
          </h1>
          <button
            className="w-16 h-16 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all ease-in-out duration-300 rounded-2xl cursor-pointer"
            onClick={() => setIsDeleteExpense(false)}
          >
            <IoCloseOutline className="text-3xl" />
          </button>
        </div>

        <div className="w-full px-12 py-6 flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold text-gray-700 tracking-wide">
            Are you sure?
          </h1>

          <img src={questionMark} className="w-40" alt="question-mark" />

          <p className="text-2xl text-gray-500 font-medium text-center tracking-wide">
            You want to delete expense for{" "}
            <span className="text-gray-700 font-bold">
              Category: {deleteExpense.category}
            </span>
          </p>
        </div>

        <div className="w-full px-12 flex flex-col gap-1">
          <div className="flex flex-col">
            <p className="text-xl text-gray-600 font-medium tracking-wide">
              Write <span className="font-semibold">DELETE</span> below to
              delete the expense.
            </p>
            <Input
              type="text"
              id="deleteExpense"
              name="deleteExpense"
              placeholder=""
              value={writeDelete}
              onChange={(e) => setWriteDelete(e.target.value)}
              icon={<CiTrash />}
              label=""
            />
          </div>
          <button
            type="button"
            className="w-fit px-8 py-4 my-6 bg-red-500 rounded-2xl text-white text-xl tracking-wide hover:bg-red-600 transition-all ease-in-out cursor-pointer disabled:cursor-not-allowed disabled:bg-red-400/40 disabled:text-red-600"
            disabled={writeDelete === "DELETE" ? false : true}
            onClick={handleDeleteExpense}
          >
            {loading ? (
              <div className="flex items-center gap-4">
                <Loading w="w-8" h="h-8" />
                Deleting Expense
              </div>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteExpense;
