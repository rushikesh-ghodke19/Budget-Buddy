import axios from "axios";
import { useState } from "react";

const useApi = () => {
  const [loading, setLoading] = useState(false);

  const callApi = async (method, url, body = {}, config = {}) => {
    setLoading(true);
    try {
      const response = await axios({
        method,
        url,
        data: body,
        ...config,
      });

      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data || error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading };
};

export default useApi;
