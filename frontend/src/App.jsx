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
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";

function App() {
  const { isUserLoggedIn } = useContext(Data);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isUserLoggedIn ? (
                <Navigate to="/profile" />
              ) : (
                <Navigate to="/auth/signin" />
              )
            }
          />
          <Route path="/auth" element={<Layout />}>
            <Route
              path="signin"
              element={!isUserLoggedIn ? <SignIn /> : <Navigate to="/" />}
            />
            <Route
              path="signup"
              element={!isUserLoggedIn ? <SignUp /> : <Navigate to="/" />}
            />
            <Route
              path="otp-verification"
              element={
                !isUserLoggedIn ? (
                  <OtpVerification />
                ) : (
                  <Navigate to="/auth/signin" />
                )
              }
            />
            <Route
              path="send-resetpassword-otp"
              element={<SendResetPasswordOtp />}
            />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          <Route
            path="/profile"
            element={isUserLoggedIn ? <Home /> : <Navigate to="/auth/signin" />}
          >
            <Route index element={<Profile />} />
            <Route
              path="add-expense"
              element={
                isUserLoggedIn ? <AddExpense /> : <Navigate to="/auth/signin" />
              }
            />
            <Route
              path="view-expenses"
              element={
                isUserLoggedIn ? (
                  <ViewExpenses />
                ) : (
                  <Navigate to="/auth/signin" />
                )
              }
            />
            <Route
              path="edit-profile"
              element={
                isUserLoggedIn ? (
                  <EditProfile />
                ) : (
                  <Navigate to="/auth/signin" />
                )
              }
            />
            <Route
              path="settings"
              element={
                isUserLoggedIn ? <Settings /> : <Navigate to="/auth/signin" />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
