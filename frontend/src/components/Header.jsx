import logo from "../assets/logo.svg";
import { useContext, useEffect, useRef, useState } from "react";
import { Data } from "../context/DataProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { RiMenu3Line } from "react-icons/ri";

const Header = () => {
  const { setIsUserLoggedIn } = useContext(Data);
  const userId = localStorage.getItem("userId");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const wrapperRef = useRef(null);

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
      navigation: "/",
    },
    {
      title: "Add Expense",
      navigation: "/add-expense",
    },
    {
      title: "View Expenses",
      navigation: "/view-expenses",
    },
    {
      title: "Logout",
      navigation: "",
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className="w-full h-28 bg-white fixed top-0 left-0 border-b border-b-gray-200 flex items-center justify-between lg:px-80 md:px-36 sm:px-32 px-10 z-50"
      ref={wrapperRef}
    >
      <div className="h-full flex items-center">
        <img src={logo} className="w-56 sm:w-64 md:w-80" alt="logo" />
      </div>

      {userId ? (
        <div className="relative h-full flex items-center">
          <button
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <RiMenu3Line className="text-3xl" />
          </button>

          <ul
            className={`absolute top-full right-0 w-96 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-4 transition-all duration-transform ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            {menu.map((item, index) =>
              item.navigation ? (
                <NavLink
                  key={index}
                  to={item.navigation}
                  className={({ isActive }) =>
                    `w-full text-xl tracking-wide font-semibold px-6 py-5 rounded-xl transition-all ${
                      isActive
                        ? `bg-budget-buddy-100 text-budget-buddy-600`
                        : "text-gray-700 hover:bg-budget-buddy-100"
                    }`
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                >
                  {item.title}
                </NavLink>
              ) : (
                <button
                  key={index}
                  onClick={handleLogout}
                  className={`w-full text-xl text-left tracking-wide font-semibold px-6 py-5 rounded-xl transition-all text-red-600 hover:bg-red-100 cursor-pointer`}
                >
                  {item.title}
                </button>
              ),
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default Header;
