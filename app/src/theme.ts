
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material';

var theme = createTheme({
  shape: {
    borderRadius: 4
  },
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  }
});

theme = responsiveFontSizes(theme);

export default theme;