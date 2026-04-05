import { forwardRef } from "react";

const Input = forwardRef(
  (
    { type, id, placeholder, value, name, onChange, icon, label },
    ref,
  ) => {
    return (
      <div className="w-full flex flex-col gap-3">
        <label
          htmlFor={id}
          className="text-xl text-budget-buddy-950 font-medium tracking-wide"
        >
          {label}
        </label>
        <div className="w-full h-20 relative">
          <input
            type={type}
            id={id}
            name={name}
            className="peer w-full h-full pl-16 pr-5 text-xl text-budget-buddy-950 font-semibold placeholder:font-normal border border-slate-200 rounded-2xl focus:border-budget-buddy-600 focus:shadow-lg focus:shadow-gray-200 valid:border-budget-buddy-600 read-only:cursor-not-allowed read-only:bg-gray-200 read-only:border-budget-buddy-600 bg-white transition-all duration-300 ease-in-out"
            placeholder={placeholder}
            value={value}
            onChange={onChange ? onChange : undefined}
            ref={ref ? ref : undefined}
            required
          />
          <p className="absolute top-1/2 -translate-y-1/2 left-3 text-3xl text-current peer-focus:text-budget-buddy-600 peer-valid:text-budget-buddy-600 peer-read-only:text-budget-buddy-600 transition-all duration-300 ease-in-out">
            {icon}
          </p>
        </div>
      </div>
    );
  },
);

export default Input;
