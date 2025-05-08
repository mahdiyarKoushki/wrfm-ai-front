import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";

import { Paper } from "@mui/material";

interface Item {
  value: string | number;
  imgSource?: string;
  class?: string;
  name: string;
}

interface SelectInputMUIProps {
  width?: string | number;
  dark?: boolean;
  label: string;
  value: string | number;
  onChange: any;
  items: Item[];
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
  name?: string;
  height?: string | number;
  onFocus?: () => void;
}

export default function SelectInputMUI({
  width,
  dark = false,
  label,
  value,
  onChange,
  items,
  disabled = false,
  helperText = "",
  error = false,
  name = "",
  height,
  onFocus,
}: SelectInputMUIProps) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const errorFieldColor = error ? "#f71905" : "gray";

  return (
    <FormControl
      onFocus={onFocus}
      error={error}
      disabled={disabled}
      sx={{
        '& .MuiOutlinedInput-root .Mui-disabled': {
          color: dark ? "#fff" : "#000",
          borderColor: errorFieldColor,
        },
        "& .MuiInputBase-input": {
          "&:-webkit-autofill": {
            WebkitBoxShadow: `0 0 0 100px ${
              dark ? "#000" : "#ffff"
            } inset`,
            WebkitTextFillColor: dark ? "#fff" : "#000",
            borderColor: errorFieldColor,
          },
        },
        width: width ? width : "100%",
        "& .MuiOutlinedInput-root": {
          height: height ? height : "46px",
          color: dark ? "#fff" : "#000",
          fontFamily: "Arial",
          fontWeight: "500",
          borderColor: errorFieldColor,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: errorFieldColor,
            borderRadius: "4px",
            borderWidth: "2px",
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: errorFieldColor,
              borderRadius: "4px",
              borderWidth: "3px",
            },
          },
          "&:hover:not(.Mui-focused)": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: errorFieldColor,
              borderRadius: "4px",
            },
          },
        },
        "& .MuiInputLabel-outlined": {
          color: dark ? "#fff" : "#000",
          fontWeight: "500",
          fontSize: "13px",
          "&.Mui-focused": {
            color: errorFieldColor,
            borderColor: errorFieldColor,
            fontWeight: "bold",
          },
        },
      }}
    >
      <InputLabel id="demo-controlled-open-select-label">{label}</InputLabel>
      <Select
        MenuProps={{
          PaperProps: {
            sx: {
              color: dark ? "#fff" : "#000",
              bgcolor: dark ? "#000" : "#fff",
              "& .MuiMenuItem-root": {
                padding: 2,
              },
            },
          },
        }}
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={value}
        label={label}
        onChange={onChange}
        // Since helperText isn't a valid prop for Select, it's omitted here.
      >
        {items?.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              {item.imgSource && (
                <img
                  src={item.imgSource}
                  alt={item.imgSource}
                  style={{ height: "40px" }}
                />
              )}
              <span className={item.class}></span>
              {item.name}
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}