import React from "react";
import { IoMdClose } from "react-icons/io";

const TimezoneItem = ({
  provided,
  item,
  index,
  darkMode,
  handleRemoveTimeZone,
  handleSliderChange,
  handleTimeChange,
  convertTimeToSliderValue,
}) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    className={`${
      darkMode ? "bg-gray-600" : "bg-white"
    } h-auto w-full p-3 mb-4 rounded-md flex items-center shadow-md`}
  >
    <div
      {...provided.dragHandleProps}
      className="flex items-center justify-center cursor-grab pr-3"
      style={{
        width: "20px",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <div className="flex flex-col items-center mr-[2px]">
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
      </div>
      <div className="flex flex-col items-center mr-[2px]">
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
        <div className="w-1 h-1 bg-gray-400 mb-1 rounded-sm"></div>
      </div>
    </div>
    <div className="flex-1">
      <div className="flex justify-between">
        <h3
          className={`${
            darkMode ? "bg-gray-600" : "bg-white"
          } font-bold text-lg mb-1`}
        >
          {item.tz}
        </h3>
        <button
          className="text-red-100 hover:text-red-700 rounded-lg"
          onClick={() => handleRemoveTimeZone(index)}
        >
          <IoMdClose size={24} />
        </button>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <input
          type="text"
          value={item.time}
          onChange={(e) => handleTimeChange(index, e.target.value)}
          className={`border p-2 rounded-lg w-24 ${
            darkMode ? "bg-gray-500 text-white" : ""
          }`}
          placeholder="hh:mm AM/PM"
        />
        <div className="flex-1 relative">
          <input
            type="range"
            min={0}
            max={1440}
            step={15}
            value={convertTimeToSliderValue(item.time)}
            onChange={(e) =>
              handleSliderChange(index, parseInt(e.target.value))
            }
            className="w-full appearance-none h-4 bg-gray-200 rounded-lg overflow-hidden focus:outline-none slider-thumb"
          />
          <div
            className={`absolute w-full top-6 flex justify-between text-xs ${
              darkMode ? "text-white" : ""
            }`}
          >
            <span className="w-[10%] text-center">12 AM</span>
            <span className="w-[12%] text-center">3 AM</span>
            <span className="w-[12%] text-center">6 AM</span>
            <span className="w-[12%] text-center">9 AM</span>
            <span className="w-[12%] text-center">12 PM</span>
            <span className="w-[12%] text-center">3 PM</span>
            <span className="w-[12%] text-center">6 PM</span>
            <span className="w-[12%] text-center">9 PM</span>
            <span className="w-[10%] text-center">12 AM</span>
          </div>
          <div className="absolute inset-x-0 top-5 flex justify-between px-2">
            <div
              className={`w-[1px] h-1 ${darkMode ? "bg-white" : "bg-black"}`}
            ></div>
            <div
              className={`w-[1px] h-1 ${darkMode ? "bg-white" : "bg-black"}`}
            ></div>
            <div
              className={`w-[1px] h-1 ${darkMode ? "bg-white" : "bg-black"}`}
            ></div>
            <div
              className={`w-[1px] h-1 ${darkMode ? "bg-white" : "bg-black"}`}
            ></div>
            <div
              className={`w-[1px] h-1 ${darkMode ? "bg-white" : "bg-black"}`}
            ></div>
            <div
              className={`w-[1px] h-1 ${darkMode ? "bg-white" : "bg-black"}`}
            ></div>
            <div
              className={`w-[1px] h-1 ${darkMode ? "bg-white" : "bg-black"}`}
            ></div>
            <div
              className={`w-[1px] h-1 ${darkMode ? "bg-white" : "bg-black"}`}
            ></div>
            <div
              className={`w-[1px] h-1 ${darkMode ? "bg-white" : "bg-black"}`}
            ></div>
          </div>
        </div>
        <div>{item.date}</div>
      </div>
    </div>
  </div>
);

export default TimezoneItem;
