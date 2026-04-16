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
    <div className="fixed inset-0 bg-black/20 lg:px-96 md:px-48 sm:px-24 px-10 z-50 flex items-center justify-center">
      <div className="sm:w-4xl w-full bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <div className="w-full px-6 py-6 flex justify-between border-b border-b-gray-200">
          <h1 className="text-2xl text-gray-700 font-semibold tracking-wide">
            Delete Expense
          </h1>
          <button
            className="w-16 h-16 flex items-center justify-center bg-gray-100 transition-all ease-in-out duration-300 rounded-2xl cursor-pointer"
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
            You want to delete the expense for{" "}
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
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-white animate-spin fill-none"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
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
