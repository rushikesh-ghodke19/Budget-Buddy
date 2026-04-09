import { createContext, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import useToast from "../hooks/useToast";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

export const Data = createContext();
const DataProvider = ({ children }) => {
  const { showError, showSuccess, showInfo, showWarning } = useToast();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    return localStorage.getItem("userLoggedIn") === "true";
  });

  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  const { callApi } = useApi();

  const handleGetUserData = async () => {
    const { data, error } = await callApi(
      "post",
      `${BASE_URL}${API_PATHS.USER.GETUSERDATA}`,
      { userId },
    );
    if (error) {
      console.log(error);
      showError("Error", error.message);
      return;
    }
    if (data?.success) {
      setUser(data?.userData);
    }
  };

  useEffect(() => {
    if (userId) handleGetUserData();
  }, [userId]);
  return (
    <Data.Provider value={{ isUserLoggedIn, setIsUserLoggedIn, user, userId }}>
      {children}
    </Data.Provider>
  );
};

export default DataProvider;
