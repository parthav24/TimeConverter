import React from "react";

const Dropdown = ({
  filteredTimeZones,
  handleSelect,
  selectedTimeZones,
  darkMode,
}) => (
  <ul
    className={`relative mt-1 w-full shadow-lg rounded-lg z-10 ${
      darkMode ? "bg-gray-500 text-white" : "bg-white"
    }`}
  >
    {filteredTimeZones.length > 0 ? (
      filteredTimeZones.map((tz) => (
        <li
          key={tz}
          className={`p-2 ${
            darkMode ? "hover:bg-gray-600" : "hover:bg-blue-200"
          } cursor-pointer ${
            selectedTimeZones.some((item) => item.tz === tz)
              ? "text-gray-400 cursor-not-allowed"
              : ""
          }`}
          onClick={() =>
            !selectedTimeZones.some((item) => item.tz === tz) &&
            handleSelect(tz)
          }
        >
          {tz}
        </li>
      ))
    ) : (
      <li className="p-2 text-gray-200">No results found</li>
    )}
  </ul>
);

export default Dropdown;
