import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import useToast from "../hooks/useToast";
import useApi from "../hooks/useApi";
import { CiAt, CiLock, CiUser } from "react-icons/ci";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import Loading from "../components/Loading";

const SignUp = () => {
  const { showError, showInfo, showWarning } = useToast();

  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const inputRefs = [useRef(null), useRef(null), useRef(null)];

  // handle input changes
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // validate step 1
  const handleContinue = () => {
    const { firstname, lastname, email } = userData;

    if (!firstname) {
      showWarning("Missing Firstname", "Please enter your firstname.");
      inputRefs[0].current.focus();
      return false;
    }
    if (!lastname) {
      showWarning("Missing Lastname", "Please enter your lastname.");
      inputRefs[1].current.focus();
      return false;
    }
    if (!email) {
      showWarning("Missing Email", "Please enter your email.");
      inputRefs[2].current.focus();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Invalid Email", "Please enter a valid email address.");
      inputRefs[2].current.focus();
      return false;
    }

    // move to password step
    setStep(2);
    showInfo(
      "Create Strong Password",
      "Include uppercase, lowercase, numbers, and special characters.",
    );
  };

  return (
    <div className="w-full h-screen bg-[radial-gradient(circle_at_center,rgba(5,223,114,0.05)_10%,rgba(254,243,198,0.1)_65%)] lg:px-72 md:px-48 sm:px-24 px-12 py-24">
      <div className="w-full h-full lg:px-72 flex flex-col justify-center gap-28">
        <div className="w-full flex flex-col sm:gap-20 gap-14">
          <div className="w-full flex justify-end">
            <div className="flex items-center gap-3">
              <p className="sm:text-2xl text-xl text-budget-buddy-950 font-medium tracking-wide">
                Already have an account?
              </p>
              <Link to="/auth/signin">
                <button
                  type="button"
                  children="Sign In"
                  className="sm:px-6 px-4 sm:py-3 py-2 sm:text-2xl text-xl  rounded-2xl tracking-wide font-medium bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white transition-all ease-in-out cursor-pointer"
                ></button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-center md:text-6xl sm:text-5xl text-4xl font-semibold text-budget-buddy-950 tracking-wide">
              {step === 1
                ? "Create Your Free Account"
                : "Create a Strong Password"}
            </h1>
            <p className="sm:text-2xl text-lg text-budget-buddy-950/60 text-center font-medium tracking-wide">
              Get started by creating your secure account.
            </p>
          </div>

          <form autoComplete="off" className="flex flex-col items-center">
            <div className="sm:w-200 w-full flex flex-col items-center sm:gap-10 gap-6">
              {step === 1 ? (
                <>
                  <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-10">
                    <div className="flex flex-col gap-4">
                      <Input
                        type="text"
                        id="firstname"
                        name="firstname"
                        placeholder="Enter Your Firstname"
                        value={userData.firstname}
                        onChange={handleChange}
                        icon={<CiUser />}
                        label="Firstname"
                        ref={inputRefs[0]}
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <Input
                        type="text"
                        id="lastname"
                        name="lastname"
                        placeholder="Enter Your Lastname"
                        value={userData.lastname}
                        onChange={handleChange}
                        icon={<CiUser />}
                        label="Lastname"
                        ref={inputRefs[1]}
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-4">
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter Your Email"
                      value={userData.email}
                      onChange={handleChange}
                      icon={<CiAt />}
                      label="Email"
                      ref={inputRefs[2]}
                    />
                  </div>
                  <div className="w-full flex justify-center">
                    <button
                      type="button"
                      children="Continue"
                      className="px-32 py-6 rounded-2xl text-3xl font-medium bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white tracking-wide transition-colors ease-in-out cursor-pointer"
                      onClick={handleContinue}
                    ></button>
                  </div>
                </>
              ) : (
                <Password userData={userData} setStep={setStep} />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

const Password = ({ userData, setStep }) => {
  const { showError, showInfo, showWarning, showSuccess } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRefs = [useRef(null), useRef(null)];
  const navigate = useNavigate();

  const { callApi, loading } = useApi();

  const handleSignUp = async () => {
    console.log("Handle Signup hit");
    if (!password) {
      showInfo("Missing Password", "Please enter your password.");
      inputRefs[0].current.focus();
      return;
    }

    if (!confirmPassword) {
      showInfo("Confirm Password", "Please confirm your password.");
      inputRefs[1].current.focus();
      return;
    }

    if (password.length < 8) {
      showInfo(
        "Short password",
        "Your password must be at least 8 characters.",
      );
      return;
    }

    if (password.includes(" ")) {
      return showWarning(
        "Invalid Characters",
        "Passwords cannot contain spaces.",
      );
    }

    if (password !== confirmPassword) {
      return showError("Password Mismatch", "Passwords do not match.");
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/;

    if (!strongPassword.test(password)) {
      return showError(
        "Weak Password",
        "Include uppercase, lowercase, number, and special character.",
      );
    }

    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.AUTH.SIGNUP}`,
      {
        ...userData,
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
    }

    showSuccess("SignUp Successful!", "OTP sent to your email.");

    localStorage.setItem("userId", data.userData._id);
    localStorage.setItem("otpExpireAt", data.userData.verifyOtpExpireAt);

    setTimeout(() => {
      navigate(
        `/auth/otp-verification?purpose=signup&email=${data.userData.email}`,
      );
    }, 1500);
  };

  return (
    <div className="md:w-160 w-full flex flex-col sm:gap-10 gap-6">
      <div className="flex flex-col gap-4">
        <Input
          type="password"
          name="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<CiLock />}
          label="Password"
          ref={inputRefs[0]}
        />

        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<CiLock />}
          label="Confirm Password"
          ref={inputRefs[1]}
        />
      </div>

      <div className="w-full flex items-center justify-center gap-8">
        <button
          type="button"
          children="Back"
          className="w-fit sm:px-20 px-16 py-6 rounded-2xl text-3xl font-medium bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white tracking-wide transition-colors ease-in-out cursor-pointer"
          onClick={() => setStep(1)}
        ></button>
        <button
          type="button"
          className="w-fit sm:px-20 px-16 py-6 rounded-2xl text-3xl font-medium bg-budget-buddy-400/20 text-budget-buddy-600 hover:bg-budget-buddy-600 hover:text-white transition-colors ease-in-out cursor-pointer"
          onClick={handleSignUp}
        >
          {loading ? (
            <div className="flex items-center gap-4">
              <Loading w="w-8" h="h-8" />
              Signing Up
            </div>
          ) : (
            "Sign Up"
          )}
        </button>
      </div>
    </div>
  );
};
