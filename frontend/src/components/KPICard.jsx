import React from "react";
import Loading from "./Loading";

const KPICard = ({ title, value, loading }) => {
  return (
    <div className="w-full border border-gray-200 p-6 rounded-2xl">
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-xl text-gray-800 font-semibold tracking-wide">
          {title}
        </h1>
        {loading ? (
          <Loading w="w-8" h="h-8" />
        ) : (
          <h2 className="text-xl text-green-600 font-semibold">
            <span className="text-[2rem] ">₹ </span>
            {value}
          </h2>
        )}
      </div>
    </div>
  );
};

export default KPICard;
