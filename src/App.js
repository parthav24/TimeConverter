import { DragDropContext } from "@hello-pangea/dnd";
import Header from "./Components/Header";
import TimezoneList from "./Components/TimezoneList";
import useTimezones from "./Components/useTimezone";

function App() {
  const {
    searchQuery,
    filteredTimeZones,
    isDropdownVisible,
    selectedTimeZones,
    selectedDate,
    darkMode,
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
  } = useTimezones();

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
          <Header
            darkMode={darkMode}
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            isDropdownVisible={isDropdownVisible}
            dropdownRef={dropdownRef}
            filteredTimeZones={filteredTimeZones}
            selectedTimeZones={selectedTimeZones}
            handleSelect={handleSelect}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            toggleDarkMode={toggleDarkMode}
            handleSort={handleSort}
            handleLuLinkClick={handleLuLinkClick}
            generateGoogleCalendarLink={generateGoogleCalendarLink}
          />
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-blue-400"
            } h-5/6 w-full rounded-b-lg p-5 overflow-hidden`}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <TimezoneList
                selectedTimeZones={selectedTimeZones}
                handleRemoveTimeZone={handleRemoveTimeZone}
                handleSliderChange={handleSliderChange}
                handleTimeChange={handleTimeChange}
                darkMode={darkMode}
                convertTimeToSliderValue={convertTimeToSliderValue}
              />
            </DragDropContext>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
