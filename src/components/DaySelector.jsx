import { useState } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";

function DaySelector(props) {
  const [selectedDays, setSelectedDays] = useState(props.selectedDays || []);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedDays(value);

    props.onSelectedDays(value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="day-selector-label">Select off Days no(s)</InputLabel>
        <Select
          labelId="day-selector-label"
          id="day-selector"
          multiple
          value={selectedDays}
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {selected.map((day) => (
                <ListItemText key={day} primary={day} />
              ))}
            </Box>
          )}
        >
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <MenuItem key={day} value={day}>
              <ListItemText primary={day} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default DaySelector;
