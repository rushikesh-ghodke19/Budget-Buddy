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
  const { callApi, loading } = useApi();
  const { showError, showInfo, showSuccess, showWarning } = useToast();
  const navigate = useNavigate();

  const handleUploadUserImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File must be under 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId);

    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.USER.UPLOADUSERIMAGE}`,
      formData,
    );

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
    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.USER.DELETEUSERIMAGE}`,
      { userId },
    );

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
    <div className="flex sm:flex-row flex-col items-center gap-8">
      <div className={`${w} ${h} rounded-full overflow-hidden`}>
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
              {loading ? (
                <div className="flex items-center gap-4">
                  <Loading w="w-8" h="h-8" />
                  Uploading
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
                {loading ? (
                  <div className="flex items-center gap-4">
                    <Loading w="w-8" h="h-8" />
                    Deleting
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
          <p className="text-xl text-slate-400 font-medium tracking-wide">
            We supports PNGs, JPGs, and JPEGs under 2MB
          </p>
        </div>
      )}
    </div>
  );
};

export default UserImage;
