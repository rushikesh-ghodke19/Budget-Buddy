// export const BASE_URL = "http://localhost:8080";
export const BASE_URL = "https://budget-buddy-server-dq0g.onrender.com";

export const API_PATHS = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    SIGNIN: "/api/auth/signin",
    OTPVERIFICATION: "/api/auth/otp-verification",
    SENDRESETPASSWORDOTP: "/api/auth/send-resetpassword-otp",
    RESETPASSWORD: "/api/auth/reset-password",
    RESENDOTP: "/api/auth/resend-otp",
  },
  USER: {
    GETUSERDATA: "/api/user/userdata",
  },
  EXPENSE: {
    ADDEXPENSE: "/api/expenses/add-expense",
    VIEWEXPENSE: "/api/expenses/view-expenses",
    GETSTATS: "/api/expenses/get-stats",
    EDITEXPENSE: "/api/expenses/edit-expense",
    DELETEEXPENSE: "/api/expenses/delete-expense",
  },
};
