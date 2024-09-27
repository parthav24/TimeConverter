import { useState, useEffect, useRef } from "react";
import moment from "moment-timezone";
import { useNavigate, useLocation } from "react-router-dom";

const useTimezones = () => {
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

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "") {
      setIsDropdownVisible(false);
    } else {
      const filtered = timeZones
        .filter((tz) => tz.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setFilteredTimeZones(filtered);
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

  useEffect(() => {
    const path = selectedTimeZones.map((tz) => tz.tz).join("-to-");
    if (path) {
      navigate(`/${path}`);
    } else {
      navigate("/");
    }
  }, [selectedTimeZones, navigate]);

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

  return {
    timeZones,
    searchQuery,
    setSearchQuery,
    filteredTimeZones,
    setFilteredTimeZones,
    isDropdownVisible,
    setIsDropdownVisible,
    selectedTimeZones,
    setSelectedTimeZones,
    selectedDate,
    setSelectedDate,
    darkMode,
    setDarkMode,
    isAscending,
    setIsAscending,
    dropdownRef,
    handleSearch,
    handleSelect,
    handleSliderChange,
    handleTimeChange,
    handleDateChange,
    handleRemoveTimeZone,
    toggleDarkMode,
    handleSort,
    convertTimeToSliderValue,
    onDragEnd,
    generateGoogleCalendarLink,
    handleLuLinkClick,
  };
};

export default useTimezones;
