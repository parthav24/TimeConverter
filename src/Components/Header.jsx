import React from "react";
import { RiCalendarScheduleFill, RiArrowUpDownFill } from "react-icons/ri";
import { MdDarkMode } from "react-icons/md";
import { LuLink } from "react-icons/lu";
import Dropdown from "./Dropdown";

const Header = ({
  darkMode,
  searchQuery,
  handleSearch,
  isDropdownVisible,
  dropdownRef,
  filteredTimeZones,
  selectedTimeZones,
  handleSelect,
  selectedDate,
  handleDateChange,
  toggleDarkMode,
  handleSort,
  handleLuLinkClick,
  generateGoogleCalendarLink,
}) => (
  <div
    className={`${
      darkMode ? "bg-gray-600" : "bg-blue-500"
    } h-1/6 w-full rounded-t-lg p-5 flex items-center justify-between gap-2`}
  >
    <div className="bg-white h-full w-full rounded-lg" ref={dropdownRef}>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search timezone"
        className={`h-full w-full rounded-md focus:outline-none px-3 ${
          darkMode ? "bg-gray-500 text-white" : ""
        }`}
      />
      {isDropdownVisible && (
        <Dropdown
          filteredTimeZones={filteredTimeZones}
          handleSelect={handleSelect}
          selectedTimeZones={selectedTimeZones}
          darkMode={darkMode}
        />
      )}
    </div>
    <div className="bg-white h-full w-full rounded-lg items-start justify-around">
      <input
        name="tdate"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className={`h-full w-full rounded-md px-3 ${
          darkMode ? "bg-gray-500 text-white" : ""
        }`}
      />
    </div>
    <div
      className={` h-full w-full rounded-md flex items-center justify-around ${
        darkMode ? "bg-gray-500 text-white" : "bg-white"
      }`}
    >
      <button>
        <RiCalendarScheduleFill
          size={24}
          onClick={() => {
            if (selectedTimeZones.length > 0) {
              const firstTimeZone = selectedTimeZones[0];
              const link = generateGoogleCalendarLink(
                firstTimeZone.tz,
                selectedDate,
                firstTimeZone.time
              );
              window.open(link, "_blank");
            }
          }}
        />
      </button>
      <button onClick={handleSort}>
        <RiArrowUpDownFill size={24} />
      </button>
      <button onClick={handleLuLinkClick}>
        <LuLink size={24} />
      </button>
      <button onClick={toggleDarkMode}>
        <MdDarkMode size={24} />
      </button>
    </div>
  </div>
);

export default Header;
