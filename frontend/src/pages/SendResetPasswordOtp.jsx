import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Loading from "../components/Loading";
import useApi from "../hooks/useApi";
import useToast from "../hooks/useToast";
import { CiAt } from "react-icons/ci";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

const SendResetPasswordOtp = () => {
  const [email, setEmail] = useState("");

  const inputRef = useRef(null);

  const { callApi, loading } = useApi();
  const { showInfo, showWarning, showSuccess, showError } = useToast();

  const navigate = useNavigate();

  const handleSendResetPasswordOtp = async () => {
    console.log("step 1");
    if (!email) {
      showInfo(
        "Email Missing",
        "Please provide your email address to proceed.",
      );
      inputRef.current.focus();
      return false;
    }
    console.log("step 2");
    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.AUTH.SENDRESETPASSWORDOTP}`,
      { email },
    );
    console.log("Response: ", data);
    console.log("step 3");
    if (error) {
      showError("SignUp Failed", error?.message || "Something went wrong.");
      console.error("ERROR:", error);
      return;
    }
    console.log("step 4");
    if (!data) return;
    console.log("step 5");
    if (!data.success) {
      showWarning("Warning", data.message);
      return;
    }
    console.log("step 6");
    showSuccess("Otp Sent", "OTP sent to your email.");
    console.log("step 7");
    localStorage.setItem("userId", data.userData._id);
    localStorage.setItem("otpExpireAt", data.userData.verifyOtpExpireAt);
    console.log("step 8");
    setTimeout(() => {
      navigate(
        `/auth/otp-verification?purpose=send-resetpassword-otp&email=${data?.userData.email}`,
      );
    }, 1500);
  };
  return (
    <div className="w-full h-screen bg-[radial-gradient(circle_at_center,rgba(5,223,114,0.05)_10%,rgba(254,243,198,0.1)_65%)] lg:px-72 md:px-48 sm:px-24 px-12 py-24">
      <div className="w-full h-full lg:px-72 flex flex-col justify-center gap-28">
        <div className="w-full flex flex-col items-center gap-20">
          <div className="w-full flex justify-end">
            <div className="flex items-center gap-3">
              <p className="sm:text-2xl text-xl text-budget-buddy-950 font-medium tracking-wide">
                Already have an account?
              </p>
              <Link to="/auth/signin">
                <button
                  type="button"
                  children="Sign In"
                  className="sm:px-6 px-4 sm:py-3 py-2 sm:text-2xl text-xl rounded-2xl tracking-wide font-medium bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
                ></button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-center md:text-6xl sm:text-5xl text-4xl font-semibold text-budget-buddy-950 tracking-wide">
              Reset Your Password
            </h1>
            <p className="text-lg text-budget-buddy-950/60 text-center font-medium tracking-wide">
              Enter your email to continue.
            </p>
          </div>

          <form autoComplete="off">
            <div className="sm:w-160 w-120 flex flex-col gap-8">
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<CiAt />}
                label="Email"
                ref={inputRef}
              />
              <div className="w-full flex justify-center">
                <button
                  type="button"
                  className="px-26 py-6 rounded-2xl text-3xl font-medium bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white tracking-wide transition-colors duration-300 ease-in-out cursor-pointer"
                  onClick={handleSendResetPasswordOtp}
                >
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <Loading w="w-8" h="h-8" />
                      Sending OTP
                    </div>
                  ) : (
                    "Continue"
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

export default SendResetPasswordOtp;
