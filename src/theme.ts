import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF4444', // Bright red
    },
    secondary: {
      main: '#4CAF50', // Bright green
    },
    background: {
      default: '#F7F7F7',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Nunito", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#FF4444',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
        },
      },
    },
  },
}); 