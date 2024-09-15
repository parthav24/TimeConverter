import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LuLink } from "react-icons/lu";
import { MdDarkMode } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import moment from "moment-timezone";
import { RiArrowUpDownFill, RiCalendarScheduleFill } from "react-icons/ri";

function App() {
  const timeZones = moment.tz.names();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTimeZones, setFilteredTimeZones] = useState(
    timeZones.slice(0, 5)
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedTimeZones, setSelectedTimeZones] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [darkMode, setDarkMode] = useState(true);
  const [isAscending, setIsAscending] = useState(true);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownVisible]);

  useEffect(() => {
    // Update the URL whenever the selectedTimeZones changes
    const path = selectedTimeZones.map((tz) => tz.tz).join("-to-");
    if (path) {
      navigate(`/${path}`);
    } else {
      navigate("/");
    }
  }, [selectedTimeZones, navigate]);

  useEffect(() => {
    const pathTimezones = location.pathname.substring(1).split("-to-");
    const validTimeZones = pathTimezones.filter((tz) =>
      moment.tz.names().includes(tz)
    );

    if (validTimeZones.length > 0) {
      const initializedZones = validTimeZones.map((tz) => ({
        tz,
        time: moment.tz(tz).format("hh:mm A"),
        date: selectedDate,
        sliderValue: 720,
      }));
      setSelectedTimeZones(initializedZones);
    }
  }, [location.pathname, selectedDate]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "") {
      setIsDropdownVisible(false);
    } else {
      setFilteredTimeZones(
        timeZones
          .filter((tz) => tz.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
      );
      setIsDropdownVisible(true);
    }
  };

  const handleSelect = (tz) => {
    setSearchQuery("");
    setIsDropdownVisible(false);
    if (!selectedTimeZones.some((item) => item.tz === tz)) {
      const currentTime = moment.tz(tz).format("hh:mm A");

      setSelectedTimeZones([
        ...selectedTimeZones,
        { tz, time: currentTime, date: selectedDate, sliderValue: 720 },
      ]);
    }
  };

  const handleSliderChange = (index, value) => {
    if (value < 1) value = 1;
    if (value > 1439) value = 1439;

    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;

    const formattedTime = `${String(adjustedHours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")} ${ampm}`;

    const updatedTimeZones = selectedTimeZones.map((item, idx) =>
      idx === index ? { ...item, sliderValue: value } : item
    );
    setSelectedTimeZones(updatedTimeZones);

    handleTimeChange(index, formattedTime);
  };

  const handleTimeChange = (index, newTime) => {
    const isValidTime = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.test(newTime);
    if (!isValidTime) return;

    const baseTime = moment.tz(
      `${selectedDate} ${newTime}`,
      "YYYY-MM-DD hh:mm A",
      selectedTimeZones[index].tz
    );

    const updatedTimeZones = selectedTimeZones.map((item, idx) => {
      const newTimeForZone = baseTime.clone().tz(item.tz);
      return {
        ...item,
        time: newTimeForZone.format("hh:mm A"),
        date: newTimeForZone.format("YYYY-MM-DD"),
      };
    });

    setSelectedTimeZones(updatedTimeZones);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    const updatedTimeZones = selectedTimeZones.map((item) => {
      const baseTime = moment.tz(
        `${newDate} ${item.time}`,
        "YYYY-MM-DD hh:mm A",
        item.tz
      );
      return {
        ...item,
        time: baseTime.format("hh:mm A"),
        date: baseTime.format("YYYY-MM-DD"),
      };
    });

    setSelectedTimeZones(updatedTimeZones);
  };

  const handleRemoveTimeZone = (index) => {
    const updatedTimeZones = selectedTimeZones.filter(
      (_, idx) => idx !== index
    );
    setSelectedTimeZones(updatedTimeZones);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleSort = () => {
    const sortedTimeZones = [...selectedTimeZones].sort((a, b) => {
      if (isAscending) {
        return a.time.localeCompare(b.time, undefined, { numeric: true });
      } else {
        return b.time.localeCompare(a.time, undefined, { numeric: true });
      }
    });

    setSelectedTimeZones(sortedTimeZones);
    setIsAscending(!isAscending);
  };

  const convertTimeToSliderValue = (time) => {
    const [hourMin, ampm] = time.split(" ");
    let [hours, minutes] = hourMin.split(":").map(Number);
    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(selectedTimeZones);
    const [movedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, movedItem);

    setSelectedTimeZones(items);
  };

  const generateGoogleCalendarLink = (timezone, date, time) => {
    // Convert the selected time to IST (Indian Standard Time)
    const istTimezone = "Asia/Kolkata";

    // Convert the selected time to IST equivalent
    const startDatetimeIST = moment
      .tz(`${date} ${time}`, "YYYY-MM-DD hh:mm A", timezone)
      .tz(istTimezone)
      .format("YYYYMMDDTHHmmss");

    // Set a 1-hour duration for the meeting in IST
    const endDatetimeIST = moment
      .tz(`${date} ${time}`, "YYYY-MM-DD hh:mm A", timezone)
      .tz(istTimezone)
      .add(2, "hour")
      .format("YYYYMMDDTHHmmss");

    // Generate the description with all selected time zones
    const description = selectedTimeZones
      .map((item) => {
        // Use the original selected date and time for each timezone without converting it
        const formattedDate = moment
          .tz(`${date} ${time}`, "YYYY-MM-DD hh:mm A", item.tz)
          .format("ddd, MMM D YYYY");
        return `${item.tz}: ${item.time} ${formattedDate}`;
      })
      .join("\n");

    // Get the location of the first selected time zone
    const firstTimeZoneLocation =
      selectedTimeZones.length > 0 ? selectedTimeZones[0].tz : "";

    // Format the Google Calendar link, scheduling the meeting in IST
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting&dates=${startDatetimeIST}/${endDatetimeIST}&ctz=${istTimezone}&details=${encodeURIComponent(
      description
    )}&location=${encodeURIComponent(firstTimeZoneLocation)}`;
  };

  const handleLuLinkClick = () => {
    const currentUrl = window.location.origin + location.pathname;

    // Copy the URL to the clipboard
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("URL copied to clipboard: " + currentUrl);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <>
      <div
        className={`h-screen w-screen flex items-center justify-center ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-gradient-to-r from-blue-100 to-blue-300"
        }`}
      >
        <div
          className={`${
            darkMode ? "bg-gray-700" : "bg-blue-300"
          } h-[500px] w-[700px] rounded-lg shadow-2xl`}
        >
          <div
            className={`${
              darkMode ? "bg-gray-600" : "bg-blue-500"
            } h-1/6 w-full rounded-t-lg p-5 flex items-center justify-between gap-2`}
          >
            <div
              className="bg-white h-full w-full rounded-lg"
              ref={dropdownRef}
            >
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
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-blue-400"
            } h-5/6 w-full rounded-b-lg p-5 overflow-hidden`}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div
                    className={`${
                      darkMode ? "bg-gray-600" : "bg-white"
                    } h-full w-full rounded-md shadow-lg p-5 overflow-y-auto max-h-[350px]`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {selectedTimeZones.length > 0 ? (
                      selectedTimeZones.map((item, index) => (
                        <Draggable
                          key={item.tz}
                          draggableId={item.tz}
                          index={index}
                        >
                          {(provided) => (
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
                                    onChange={(e) =>
                                      handleTimeChange(index, e.target.value)
                                    }
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
                                      value={convertTimeToSliderValue(
                                        item.time
                                      )}
                                      onChange={(e) =>
                                        handleSliderChange(
                                          index,
                                          parseInt(e.target.value)
                                        )
                                      }
                                      className="w-full appearance-none h-4 bg-gray-200 rounded-lg overflow-hidden focus:outline-none slider-thumb"
                                    />
                                    <div
                                      className={`absolute w-full top-6 flex justify-between text-xs ${
                                        darkMode ? "text-white" : ""
                                      }`}
                                    >
                                      <span className="w-[10%] text-center">
                                        12 AM
                                      </span>
                                      <span className="w-[12%] text-center">
                                        3 AM
                                      </span>
                                      <span className="w-[12%] text-center">
                                        6 AM
                                      </span>
                                      <span className="w-[12%] text-center">
                                        9 AM
                                      </span>
                                      <span className="w-[12%] text-center">
                                        12 PM
                                      </span>
                                      <span className="w-[12%] text-center">
                                        3 PM
                                      </span>
                                      <span className="w-[12%] text-center">
                                        6 PM
                                      </span>
                                      <span className="w-[12%] text-center">
                                        9 PM
                                      </span>
                                      <span className="w-[10%] text-center">
                                        12 AM
                                      </span>
                                    </div>
                                    <div className="absolute inset-x-0 top-5 flex justify-between px-2">
                                      <div
                                        className={`w-[1px] h-1 ${
                                          darkMode ? "bg-white" : "bg-black"
                                        }`}
                                      ></div>
                                      <div
                                        className={`w-[1px] h-1 ${
                                          darkMode ? "bg-white" : "bg-black"
                                        }`}
                                      ></div>
                                      <div
                                        className={`w-[1px] h-1 ${
                                          darkMode ? "bg-white" : "bg-black"
                                        }`}
                                      ></div>
                                      <div
                                        className={`w-[1px] h-1 ${
                                          darkMode ? "bg-white" : "bg-black"
                                        }`}
                                      ></div>
                                      <div
                                        className={`w-[1px] h-1 ${
                                          darkMode ? "bg-white" : "bg-black"
                                        }`}
                                      ></div>
                                      <div
                                        className={`w-[1px] h-1 ${
                                          darkMode ? "bg-white" : "bg-black"
                                        }`}
                                      ></div>
                                      <div
                                        className={`w-[1px] h-1 ${
                                          darkMode ? "bg-white" : "bg-black"
                                        }`}
                                      ></div>
                                      <div
                                        className={`w-[1px] h-1 ${
                                          darkMode ? "bg-white" : "bg-black"
                                        }`}
                                      ></div>
                                      <div
                                        className={`w-[1px] h-1 ${
                                          darkMode ? "bg-white" : "bg-black"
                                        }`}
                                      ></div>
                                    </div>
                                  </div>
                                  <div>{item.date}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p className={`${darkMode?"text-gray-400":"text-gray-600"}`}>No timezones selected</p>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
