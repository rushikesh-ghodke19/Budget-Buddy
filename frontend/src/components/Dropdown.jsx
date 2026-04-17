import { FaChevronDown } from "react-icons/fa";

const Dropdown = ({
  width,
  label,
  data,
  selected,
  setSelected,
  type,
  activeDropdown,
  setActiveDropdown,
  disabled = false,
}) => {
  const isOpen = activeDropdown === type;

  return (
    <div className="relative w-full">
      <button
        onClick={(e) => {
          setActiveDropdown(isOpen ? null : type);
          e.stopPropagation();
        }}
        className={`${width} h-18 px-4 rounded-2xl bg-white border border-gray-300 flex justify-between items-center text-xl font-medium tracking-wide disabled:cursor-not-allowed`}
        disabled={disabled}
      >
        {selected ? selected : label}
        <FaChevronDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute top-full left-0 md:w-90 w-full p-4 border border-gray-300 rounded-2xl mt-4 bg-white transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        } z-10`}
      >
        <ul className="h-80 bg-white overflow-y-auto flex flex-col gap-2">
          {data.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setSelected(item);
                setActiveDropdown(null);
              }}
              className={`p-4 text-xl rounded-xl cursor-pointer tracking-wide transition-all ease-in-out ${selected === item ? "bg-budget-buddy-50 text-budget-buddy-700" : "hover:bg-budget-buddy-50 text-budget-buddy-950"}`}
            >
              <input
                type="radio"
                value={item}
                name={type}
                checked={selected === item}
                readOnly
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
