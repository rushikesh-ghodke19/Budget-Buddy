import UserImage from "../components/UserImage";
import Input from "../components/Input";
import { useContext } from "react";
import { Data } from "../context/DataProvider";
import { CiAt } from "react-icons/ci";
import { useState } from "react";

const EditProfile = () => {
  const { user } = useContext(Data);
  const [disabled, setDisabled] = useState(true);
  return (
    <div className="w-full h-full flex justify-between gap-8 min-h-0 overflow-hidden">
      <div className="sm:w-[70%] w-full h-full flex flex-col gap-8">
        <div className="w-full bg-white p-8 border border-gray-200 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.06)]">
          <h1 className="text-2xl text-gray-800 font-semibold tracking-wide mb-4">
            Your Profile Image
          </h1>
          <UserImage w="w-48" h="h-48" showActions={true} />
        </div>
        
        <div className="w-full h-full bg-white p-8 border border-gray-200 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.06)]">
          {/* <div className="w-full h-full flex flex-col gap-4">
            <h1 className="text-2xl text-gray-800 font-semibold tracking-wide">
              Your Details
            </h1>
            <form className="w-full flex flex-col gap-8">
              <div className="w-full flex items-center gap-8">
                <Input
                  type="text"
                  id="firstname"
                  placeholder="Firstname"
                  value={user?.firstname}
                  name="firstname"
                  onChange=""
                  disabled={disabled}
                  icon={<CiAt />}
                  label="Firstname"
                />
                <Input
                  type="text"
                  id="lastname"
                  placeholder="Lastname"
                  value={user?.lastname}
                  name="lastname"
                  onChange=""
                  disabled={disabled}
                  icon={<CiAt />}
                  label="Lastname"
                />
              </div>
              <div className="w-full flex items-center gap-8">
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={user?.email}
                  name="email"
                  onChange=""
                  disabled={disabled}
                  icon={<CiAt />}
                  label="Email"
                />
                <Input
                  type="number"
                  id="phoneNumber"
                  placeholder="Phone Number"
                  value={user?.phoneNumber}
                  name="phoneNumber"
                  onChange=""
                  disabled={disabled}
                  icon={<CiAt />}
                  label="Phone Number"
                />
              </div>
              <div className="w-full flex items-center gap-4">
                {!disabled ? (
                  <button className="px-8 py-5 bg-budget-buddy-400/20 rounded-2xl text-budget-buddy-600 hover:text-white text-xl tracking-wide hover:bg-budget-buddy-600 transition-all ease-in-out cursor-pointer">
                    Update Profile
                  </button>
                ) : (
                  <button
                    className="px-8 py-5 bg-green-400/20 rounded-2xl text-green-600 text-xl tracking-wide hover:bg-green-600 hover:text-white transition-all ease-in-out cursor-pointer"
                    onClick={() => setDisabled(false)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div> */}
        </div>
      </div>
      <div className="sm:block hidden w-[30%] h-full bg-white p-8 border border-gray-200 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.06)]"></div>
    </div>
  );
};

export default EditProfile;
