import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useToast from "../hooks/useToast";
import useApi from "../hooks/useApi";
import { Data } from "../context/DataProvider";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import Loading from "../components/Loading";

const OtpVerification = () => {
  const { user, setIsUserLoggedIn } = useContext(Data);
  const expireAt = localStorage.getItem("otpExpireAt");
  const userId = localStorage.getItem("userId");

  const [time, setTime] = useState(0);
  const [userOtp, setUserOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const navigate = useNavigate();
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const purpose = query.get("purpose");
  const email = query.get("email");

  const { showError, showInfo, showSuccess, showWarning } = useToast();
  const { callApi, loading } = useApi();

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || timeInSeconds < 0) {
      return "00 minutes : 00 seconds";
    }

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    return `${String(minutes).padStart(2, "0")} minutes : ${String(
      seconds,
    ).padStart(2, "0")} seconds`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    const newOTP = [...userOtp];
    newOTP[index] = value;
    setUserOtp(newOTP);

    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    } else if (value === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleOtpVerification = async () => {
    console.log(purpose, email);
    const enteredOtp = userOtp.join("");

    const emptyIndex = userOtp.findIndex((value) => !value);

    if (emptyIndex !== -1) {
      showInfo("Incomplete Otp", "Please enter all 6 digits to continue.");
      inputRefs[emptyIndex].current.focus();
    } else {
      const { data, error } = await callApi(
        "post",
        `${BASE_URL}${API_PATHS.AUTH.OTPVERIFICATION}`,
        { userOtp: enteredOtp, userId },
      );

      if (error) {
        console.log(error);
        showError("Error", error.message);
        return;
      }

      console.log(data);
      if (!data) return;

      if (!data.success) {
        showWarning("Warning", data.message);
        return;
      } else {
        showSuccess("Verification Successful", data.message);

        setTimeout(() => {
          if (purpose === "signup") {
            setIsUserLoggedIn(true);
            localStorage.setItem("userLoggedIn", "true");
            localStorage.setItem("token", data.token);
            localStorage.removeItem("otpExpireAt");
            navigate("/");
            return;
          }
          if (purpose === "send-resetpassword-otp") {
            localStorage.removeItem("otpExpireAt");
            localStorage.removeItem("userId");
            navigate(`/auth/reset-password?email=${email}`);
            return;
          }
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (!expireAt) return;

    const remainingSeconds = Math.floor((expireAt - Date.now()) / 1000);

    setTime(remainingSeconds > 0 ? remainingSeconds : 0);
  }, [expireAt]);

  useEffect(() => {
    if (!time) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);
  return (
    <div className="w-full h-screen bg-[radial-gradient(circle_at_center,rgba(5,223,114,0.05)_10%,rgba(254,243,198,0.1)_65%)] lg:px-72 md:px-48 sm:px-24 px-12 py-24">
      <div className="w-full h-full lg:px-72 md:px-48 sm:px-24 px-12 py-20 flex flex-col gap-20">
        <div className="w-full flex flex-col gap-20">
          <h1 className="text-center sm:text-6xl text-5xl font-semibold text-budget-buddy-950 tracking-wide">
            Verify Your Account
          </h1>
          <div className="w-full text-center">
            <p className="sm:text-3xl text-2xl text-budget-buddy-950 font-light tracking-wide leading-relaxed">
              We have sent you an OTP on your email{" "}
            </p>
            <p className="sm:text-3xl text-2xl text-budget-buddy-950 font-medium tracking-wide leading-relaxed">
              {email}
            </p>

            <p className="sm:text-3xl text-2xl text-budget-buddy-950 font-light tracking-wide leading-relaxed mt-5">
              You have only{" "}
              <span className="font-semibold">{formatTime(time)}</span> to
              verify your account.
            </p>
          </div>
        </div>

        <form
          autoComplete="off"
          className="w-full flex flex-col items-center gap-8"
        >
          <div className="w-full flex justify-center items-center gap-8 flex-wrap">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              return (
                <input
                  key={i}
                  type="number"
                  maxLength={1}
                  value={userOtp[i]}
                  ref={inputRefs[i]}
                  className="w-24 h-24 text-3xl text-budget-buddy-950 text-center font-semibold border border-budget-buddy-950/20 rounded-3xl focus:border-budget-buddy-600 valid:border-budget-buddy-600 transition-all duration-300 ease-in-out placeholder:font-bold placeholder:text-4xl placeholder:text-budget-buddy-950/30"
                  placeholder="-"
                  id="otp"
                  onChange={(e) => handleChange(e, i)}
                  autoFocus={i === 0}
                  required
                />
              );
            })}
          </div>
          <button
            type="button"
            children="Verify OTP"
            className="sm:px-32 px-16 py-7 rounded-3xl text-3xl bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white transition-all ease-in-out cursor-pointer disabled:cursor-not-allowed disabled:bg-budget-buddy-400/20"
            onClick={handleOtpVerification}
          >
            {loading ? (
              <div className="flex items-center gap-4">
                <Loading w="w-8" h="h-8" />
                Verify OTP
              </div>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
        {time === 0 ? (
          <div className="w-full flex justify-center items-center gap-8">
            <p className="sm:text-3xl text-2xl text-budget-buddy-950 font-medium">
              OTP expired
            </p>
            <button
              type="button"
              className="sm:px-10 px-6 py-4 text-2xl font-medium rounded-2xl bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white cursor-pointer transition-all ease-in-out"
              onClick={handleOtpVerification}
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <Loading w="w-8" h="h-8" />
                  Resend OTP
                </div>
              ) : (
                "Resend OTP"
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OtpVerification;
