import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { CiAt, CiLock } from "react-icons/ci";
import useToast from "../hooks/useToast";
import useApi from "../hooks/useApi";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { Data } from "../context/DataProvider";
import Loading from "../components/Loading";

const SignIn = () => {
  const { setIsUserLoggedIn } = useContext(Data);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const inputRefs = [useRef(null), useRef(null), useRef(null)];

  const navigate = useNavigate();

  const { showError, showSuccess, showInfo, showWarning } = useToast();

  const { callApi, loading } = useApi();

  const handleSignIn = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showInfo(
        "Email Missing",
        "Please provide your email address to proceed.",
      );
      inputRefs[0].current.focus();
      return false;
    }

    if (!emailRegex.test(email)) {
      showError(
        "Email Format Error",
        "The email format looks incorrect. Please enter a valid email.",
      );
      inputRefs[1].current.focus();
      return false;
    }

    if (!password) {
      showInfo("Password Missing", "Please enter your password to log in.");
      inputRefs[1].current.focus();
      return false;
    }

    //? API Call
    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.AUTH.SIGNIN}`,
      {
        email,
        password,
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
    } else {
      showSuccess("SignIn Successful");

      setTimeout(() => {
        setIsUserLoggedIn(true);
        localStorage.setItem("userId", data.userData._id);
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("token", data.token);
        localStorage.removeItem("otpExpireAt");

        navigate("/");
      }, 3000);
    }
  };
  return (
    <div className="w-full h-screen bg-[radial-gradient(circle_at_center,rgba(5,223,114,0.05)_10%,rgba(254,243,198,0.1)_65%)] lg:px-72 md:px-48 sm:px-24 px-12 py-24">
      <div className="w-full h-full lg:px-72 flex flex-col justify-center gap-28">
        <div className="w-full flex flex-col items-center gap-20">
          <div className="w-full flex justify-end">
            <div className="flex items-center gap-3">
              <p className="sm:text-2xl text-xl text-budget-buddy-950 font-medium tracking-wide">
                Don't have an account?
              </p>
              <Link to="/auth/signup">
                <button
                  type="button"
                  children="Sign Up"
                  className="sm:px-6 px-4 sm:py-3 py-2 sm:text-2xl text-xl rounded-2xl tracking-wide font-medium bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
                ></button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-center md:text-6xl sm:text-5xl text-4xl font-semibold text-budget-buddy-950 tracking-wide">
              SignIn To Your Account
            </h1>
            <p className="text-lg text-budget-buddy-950/60 text-center font-medium tracking-wide">
              Welcome back! Please enter your email & password to continue.
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
                ref={inputRefs[0]}
              />
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<CiLock />}
                label="Password"
                ref={inputRefs[1]}
              />
              <div className="flex justify-end items-center gap-3">
                <p className="sm:text-2xl text-xl text-budget-buddy-950 font-medium tracking-wide">
                  Forgot password?
                </p>
                <Link to="/auth/send-resetpassword-otp" className="sm:text-2xl text-xl rounded-2xl tracking-wide font-medium text-budget-buddy-600 transition-all duration-300 ease-in-out cursor-pointer">
                  Reset Now
                </Link>
              </div>
              <div className="w-full flex justify-center">
                <button
                  type="button"
                  className="px-26 py-6 rounded-2xl text-3xl font-medium bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white tracking-wide transition-colors duration-300 ease-in-out cursor-pointer"
                  onClick={handleSignIn}
                >
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <Loading w="w-8" h="h-8" />
                      Signing In
                    </div>
                  ) : (
                    "Sign In"
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

export default SignIn;
