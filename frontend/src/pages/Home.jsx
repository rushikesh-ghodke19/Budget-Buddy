import { useContext, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { Data } from "../context/DataProvider";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import userImg from "../assets/IMG_20210917_210850_999 (1).jpg";
import { TbLogout2 } from "react-icons/tb";
import { CiUser } from "react-icons/ci";
import { IoAdd, IoCloseOutline } from "react-icons/io5";
import { CiViewTimeline } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import UserImage from "../components/UserImage";

const Home = () => {
  const { user, setIsUserLoggedIn } = useContext(Data);
  const userId = localStorage.getItem("userId");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsUserLoggedIn(false);
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/auth/signin");
  };

  const menu = [
    {
      title: "My Profile",
      navigation: "/profile",
      icon: <CiUser className="text-3xl" />,
      exact: true,
    },
    {
      title: "Add Expense",
      navigation: "/profile/add-expense",
      icon: <IoAdd className="text-3xl" />,
    },
    {
      title: "View Expenses",
      navigation: "/profile/view-expenses",
      icon: <CiViewTimeline className="text-3xl" />,
    },
    {
      title: "Edit Profile",
      navigation: "/profile/edit-profile",
      icon: <CiEdit className="text-3xl" />,
    },
    {
      title: "Settings",
      navigation: "/profile/settings",
      icon: <CiSettings className="text-3xl" />,
    },
  ];

  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-full h-screen bg-gray-50">
        <div className="w-full h-full pt-28 flex justify-between">
          {/* Left Side */}
          <div
            className={`md:static absolute top-0 ${isMenuOpen ? "left-0" : "-left-full"} md:block md:w-1/5 sm:w-[40%] w-full h-full bg-white transition-all duration-500 ease-in-out z-50`}
          >
            <div className="absolute right-8 top-8 md:hidden block z-50">
              <button
                className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-2xl cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <IoCloseOutline className="text-3xl" />
              </button>
            </div>
            <div className="w-full h-full px-8 py-8 border-r border-r-gray-200">
              <div className="w-full h-full flex flex-col gap-8 relative">
                {/* User's Image and Name */}
                <div className="w-full flex flex-col items-center gap-6">
                  <UserImage w="w-56" h="h-56" />
                  <h1 className="text-3xl text-gray-800">
                    {user?.firstname} {user?.lastname}
                  </h1>
                </div>

                {/* Menu Links */}
                <div className="w-full flex flex-col gap-2">
                  {menu.map((item, index) => (
                    <NavLink
                      key={index}
                      to={item.navigation}
                      end={item.exact}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-2 text-xl tracking-wider font-semibold p-6 rounded-xl transition-all ${
                          isActive
                            ? `bg-budget-buddy-50 text-budget-buddy-600 border border-budget-buddy-700`
                            : "text-gray-700 hover:bg-budget-buddy-50 hover:text-budget-buddy-600 border border-white"
                        }`
                      }
                      onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                    >
                      {item.icon}
                      {item.title}
                    </NavLink>
                  ))}
                </div>

                {/* Logout Button */}
                <div
                  className="absolute w-full bottom-0 left-0"
                  onClick={handleLogout}
                >
                  <button className="w-full flex items-center gap-2 text-xl text-left tracking-wider font-semibold p-6 rounded-xl transition-all text-red-600 hover:bg-red-100 cursor-pointer">
                    <TbLogout2 className="text-3xl" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="md:w-4/5 w-full p-6 sm:px-8 sm:py-8 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
