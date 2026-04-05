import AddExpense from "./pages/AddExpense";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ViewExpenses from "./pages/ViewExpenses";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import OtpVerification from "./pages/OtpVerification";
import { useContext } from "react";
import { Data } from "./context/DataProvider";
import Home from "./pages/Home";
import SendResetPasswordOtp from "./pages/SendResetPasswordOtp";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { isUserLoggedIn } = useContext(Data);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path=""
              element={
                isUserLoggedIn ? <Home /> : <Navigate to="/auth/signin" />
              }
            />
            <Route
              path="/add-expense"
              element={
                isUserLoggedIn ? <AddExpense /> : <Navigate to="/auth/signin" />
              }
            />
            <Route
              path="/auth/signin"
              element={!isUserLoggedIn ? <SignIn /> : <Navigate to="/" />}
            />
            <Route
              path="/auth/signup"
              element={!isUserLoggedIn ? <SignUp /> : <Navigate to="/" />}
            />
            <Route
              path="/auth/otp-verification"
              element={
                !isUserLoggedIn ? (
                  <OtpVerification />
                ) : (
                  <Navigate to="/auth/signin" />
                )
              }
            />
            <Route
              path="/auth/send-resetpassword-otp"
              element={<SendResetPasswordOtp />}
            />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route
              path="/view-expenses"
              element={
                isUserLoggedIn ? (
                  <ViewExpenses />
                ) : (
                  <Navigate to="/auth/signin" />
                )
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
