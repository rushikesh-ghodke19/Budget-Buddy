import { useContext, useState } from "react";
import userImg from "../assets/user.png";
import { MdCloudUpload } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
import useApi from "../hooks/useApi";
import useToast from "../hooks/useToast";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { Data } from "../context/DataProvider";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const UserImage = ({ w, h, showActions = false }) => {
  const { user, userId } = useContext(Data);
  const { callApi } = useApi();
  const { showError, showInfo, showSuccess, showWarning } = useToast();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUploadUserImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showInfo("Info", "File must be under 2MB");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId);

    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.USER.UPLOADUSERIMAGE}`,
      formData,
    );

    setUploading(false);

    if (error) {
      showError("Upload Failed", error?.message || "Something went wrong.");
      console.error("ERROR:", error);
      return;
    }

    if (!data) return;

    if (!data.success) {
      showWarning("Warning", data.message);
      return;
    }
    showSuccess("Succes", "Your image uploaded successfully");
    navigate(0);
  };

  const handleDeleteUserImage = async () => {
    setDeleting(true);

    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.USER.DELETEUSERIMAGE}`,
      { userId },
    );

    setDeleting(false);

    if (error) {
      showError("Image not deleted", error?.message || "Something went wrong.");
      console.error("ERROR:", error);
      return;
    }

    if (!data) return;

    if (!data.success) {
      showWarning("Warning", data.message);
      return;
    }
    showSuccess("Succes", "Your image deleted successfully");
    navigate(0);
  };

  return (
    <div className=" flex sm:flex-row flex-col items-center gap-8">
      <div
        className={`${w} ${h} border-8 border-white rounded-full overflow-hidden shadow-[0_20px_20px_rgba(0,0,0,0.08)]`}
      >
        <img
          src={user?.profileImage ? user?.profileImage : userImg}
          className="w-full h-full object-cover bg-sla"
          alt="user_image"
        />
      </div>

      {showActions && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <label
              htmlFor="user_image"
              className="px-6 py-4 bg-budget-buddy-400/20 rounded-2xl text-budget-buddy-600 font-semibold hover:text-white sm:text-xl text-lg tracking-wide hover:bg-budget-buddy-600 transition-all ease-in-out cursor-pointer flex items-center gap-2"
            >
              {uploading ? (
                <div className="flex items-center gap-4">
                  <Loading w="w-8" h="h-8" />
                  Uploading Image
                </div>
              ) : (
                <>
                  <MdCloudUpload className="text-3xl" />
                  Upload Image
                </>
              )}
            </label>
            <input
              type="file"
              name="user_image"
              id="user_image"
              hidden
              onChange={handleUploadUserImage}
            />
            {user?.profileImage ? (
              <button
                className="px-6 py-4 bg-red-400/20 rounded-2xl text-red-600 font-semibold hover:text-white sm:text-xl text-lg tracking-wide hover:bg-red-600 transition-all ease-in-out cursor-pointer flex items-center gap-2"
                onClick={handleDeleteUserImage}
              >
                {deleting ? (
                  <div className="flex items-center gap-4">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-red-600 animate-spin fill-white"
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
                    Deleting Image
                  </div>
                ) : (
                  <>
                    <MdOutlineClose className="text-3xl" />
                    Delete Image
                  </>
                )}
              </button>
            ) : null}
          </div>
          <p className="text-xl text-slate-400 font-medium tracking-wider">
            We supports PNGs, JPGs, and JPEGs under 2MB
          </p>
        </div>
      )}
    </div>
  );
};

export default UserImage;
