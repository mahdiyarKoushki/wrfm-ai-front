import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface PropsValue {
  label: string;
  value: Date | null;
  setValue: React.Dispatch<React.SetStateAction<Date | null>>;
}

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const DatePickerValue: React.FC<PropsValue> = ({ value, setValue, label }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            width: 150,
            '& .MuiPickersInputBase-root': {
              height: 40,
            },
          }}
          label={label}
          value={value ? dayjs(value) : null}
          onChange={(newValue: Dayjs | null) => setValue(newValue ? newValue.toDate() : null)}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};