import { useToastContext } from "../context/ToastProvider";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoCloseCircle } from "react-icons/io5";
import { IoInformationCircle } from "react-icons/io5";
import { IoWarning } from "react-icons/io5";

const useToast = () => {
  const show = useToastContext();

  return {
    showSuccess: (title, description) =>
      show(<IoCheckmarkCircle size={25} />, title, description, "success"),
    showError: (title, description) =>
      show(<IoCloseCircle size={25} />, title, description, "error"),
    showInfo: (title, description) =>
      show(<IoInformationCircle size={25} />, title, description, "info"),
    showWarning: (title, description) =>
      show(<IoWarning size={25} />, title, description, "warning"),
  };
};

export default useToast;
