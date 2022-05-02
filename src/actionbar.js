import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Dropdown(props) {
  const [selected_value, setValue] = React.useState(" ");

  const handleChange = (event) => {
    setValue(event.target.value);
    props.handleDropdownSelection(props.label_name, event.target.value)
  };
//   console.log(props);

  return (

      <FormControl sx={{m:1, minWidth:120}} size="small">
        <InputLabel id="demo-simple-select-label">{props.label_name}</InputLabel>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selected_value}
          label={props.label_name}
          onChange={handleChange}
        > 
        <MenuItem value= " " disabled>Select {props.label_name}</MenuItem>
          { props.options.map((mandi_name) => {
              return (
            <MenuItem value={mandi_name}>{mandi_name}</MenuItem>)
          })}
        </Select>
      </FormControl>
 
  );
}
