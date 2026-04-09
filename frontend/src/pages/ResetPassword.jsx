import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { CiLock } from "react-icons/ci";
import useApi from "../hooks/useApi";
import useToast from "../hooks/useToast";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import Loading from "../components/Loading";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRefs = [useRef(null), useRef(null), useRef(null)];
  const { showError, showInfo, showSuccess, showWarning } = useToast();
  const navigate = useNavigate();

  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const purpose = query.get("purpose");
  const email = query.get("email");

  const { callApi, loading } = useApi();

  const handleResetPassword = async () => {
    if (!password) {
      showInfo("Missing Password", "Enter new password");
      inputRefs[0].current.focus();
      return;
    }
    if (!confirmPassword) {
      showInfo("Confirm Password", "Please confirm your password");
      inputRefs[1].current.focus();
      return;
    }

    //? API Call
    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.AUTH.RESETPASSWORD}`,
      { email, newPassword: password },
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
    showSuccess("Password Reset", "Your password has been reset successfully.");

    setTimeout(() => {
      navigate("/auth/signin");
    }, 2000);
  };
  return (
    <div className="w-full h-screen bg-[radial-gradient(circle_at_center,rgba(5,223,114,0.05)_10%,rgba(254,243,198,0.1)_65%)] lg:px-72 md:px-48 sm:px-24 px-12 py-24">
      <div className="w-full h-full lg:px-72 flex flex-col justify-center gap-28">
        <div className="w-full flex flex-col items-center gap-20">
          <div className="flex flex-col gap-6">
            <h1 className="text-center md:text-6xl sm:text-5xl text-4xl font-semibold text-budget-buddy-950 tracking-wide">
              Create New Password
            </h1>
            <p className="text-lg text-budget-buddy-950/60 text-center font-medium tracking-wide">
              Create new password to use account.
            </p>
          </div>

          <form autoComplete="off">
            <div className="sm:w-160 w-120 flex flex-col gap-8">
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<CiLock />}
                label="Password"
                ref={inputRefs[0]}
              />
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Confirm Your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<CiLock />}
                label="Confirm Password"
                ref={inputRefs[1]}
              />
              <div className="w-full flex justify-center">
                <button
                  type="button"
                  className="px-26 py-6 rounded-2xl text-3xl font-medium bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white tracking-wide transition-colors duration-300 ease-in-out cursor-pointer"
                  onClick={handleResetPassword}
                >
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <Loading w="w-8" h="h-8" />
                      Resetting Password
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
