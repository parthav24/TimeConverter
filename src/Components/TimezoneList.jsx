import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TimezoneItem from "./TimezoneItem";

const TimezoneList = ({
  selectedTimeZones,
  handleRemoveTimeZone,
  handleSliderChange,
  handleTimeChange,
  darkMode,
  convertTimeToSliderValue,
}) => (
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
            <Draggable key={item.tz} draggableId={item.tz} index={index}>
              {(provided) => (
                <TimezoneItem
                  provided={provided}
                  item={item}
                  index={index}
                  darkMode={darkMode}
                  handleRemoveTimeZone={handleRemoveTimeZone}
                  handleSliderChange={handleSliderChange}
                  handleTimeChange={handleTimeChange}
                  convertTimeToSliderValue={convertTimeToSliderValue}
                />
              )}
            </Draggable>
          ))
        ) : (
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No timezones selected
          </p>
        )}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default TimezoneList;
