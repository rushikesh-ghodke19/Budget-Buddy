import logo from "../assets/logo.svg";
import { RiMenu3Line } from "react-icons/ri";

const Header = ({ setIsMenuOpen }) => {
  const userLogedIn = localStorage.getItem("userLoggedIn");

  return (
    <div
      className="w-full h-28 bg-white fixed top-0 left-0 border-b border-b-gray-200 flex items-center justify-between px-8 z-50"
    >
      <div className="h-full flex items-center gap-4">
        {userLogedIn ? (
          <div
            className="relative h-full flex items-center md:hidden"
          >
            <button
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(true);
              }}
            >
              <RiMenu3Line className="text-3xl" />
            </button>
          </div>
        ) : null}
        <img src={logo} className="w-56 sm:w-64 md:w-80" alt="logo" />
      </div>
    </div>
  );
};

export default Header;
