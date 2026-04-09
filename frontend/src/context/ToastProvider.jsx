import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((icon, title, description, type) => {
    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      { id, icon, title, description, type, animation: "in" },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, animation: "out" } : t)),
      );
    }, 3000);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed top-10 right-10 flex flex-col gap-4 z-50">
        {toasts.map((toast) => {
          return (
            <div
              key={toast.id}
              className={`min-w-xl px-6 py-4 rounded-xl text-white shadow-lg text-xl ${
                toast.animation === "in"
                  ? "animate-toast-in"
                  : "animate-toast-out"
              } ${toast.type === "success" && "bg-green-600"} ${
                toast.type === "error" && "bg-red-600"
              } ${toast.type === "info" && "bg-blue-600"} ${
                toast.type === "warning" && "bg-yellow-500"
              }`}
            >
              <div className="flex gap-4">
                <div className="flex justify-start">{toast.icon}</div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold tracking-wide">
                    {toast.title}
                  </h1>
                  <p className="text-xl font-medium tracking-wider">
                    {toast.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
