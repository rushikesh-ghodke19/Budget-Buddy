import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="pt-28 h-screen overflow-hidden bg-gray-50">
        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
