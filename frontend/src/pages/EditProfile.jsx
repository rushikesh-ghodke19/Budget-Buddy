import UserImage from "../components/UserImage";

const EditProfile = () => {
  return (
    <div className="w-full h-full flex justify-between gap-8 min-h-0 overflow-hidden">
      <div className="sm:w-[70%] w-full h-full flex flex-col gap-8">
        <div className="w-full bg-white p-8 border border-gray-200 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.06)]">
          <UserImage w="w-48" h="h-48" showActions={true} />
        </div>
        <div className="w-full h-full bg-white p-8 border border-gray-200 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.06)]"></div>
      </div>
      <div className="sm:block hidden w-[30%] h-full bg-gray-200"></div>
    </div>
  );
};

export default EditProfile;
