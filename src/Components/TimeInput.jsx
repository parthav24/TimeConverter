import { useState } from "react";
import moment from "moment";

function TimeInput() {
  const [time, setTime] = useState("");

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setTime(value);

    // Validate and format time
    if (moment(value, ["hh:mm A", "h:mm A"], true).isValid()) {
      // The time is valid, you can use it here
      console.log("Valid time:", value);
    } else {
      console.log("Invalid time format");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={time}
        onChange={handleTimeChange}
        placeholder="hh:mm AM/PM"
        className="border p-2 rounded-lg"
      />
    </div>
  );
}

export default TimeInput;
