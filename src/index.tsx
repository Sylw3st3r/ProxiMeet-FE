import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";
import "./index.css";
import App from "./App";
import "./translations/i18n";

import {
  blue,
  pink,
  deepPurple,
  amber,
  teal,
  green,
} from "@mui/material/colors";
import AuthProvider from "./authentication/AuthProvider";

// Corporate Theme - Professional and clean
const corporateTheme = createTheme({
  palette: {
    primary: {
      main: blue[700],
      light: blue[500],
      dark: blue[900],
    },
    secondary: {
      main: pink[500],
      light: pink[300],
      dark: pink[700],
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
});

// Creative Theme - Vibrant and artistic
const creativeTheme = createTheme({
  palette: {
    primary: {
      main: deepPurple[700],
      light: deepPurple[400],
      dark: deepPurple[900],
    },
    secondary: {
      main: amber[500],
      light: amber[300],
      dark: amber[700],
    },
    background: {
      default: "#fff3e0",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto Slab", serif',
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 700,
  },
});

const theme = createTheme({});

// Nature Theme - Earthy tones
const natureTheme = createTheme({
  palette: {
    primary: {
      main: teal[700],
      light: teal[400],
      dark: teal[900],
    },
    secondary: {
      main: green[500],
      light: green[300],
      dark: green[700],
    },
    background: {
      default: "#e8f5e9",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
});

// Dark Theme - Modern and sleek
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: blue[200],
      light: blue[300],
      dark: blue[400],
    },
    secondary: {
      main: pink[200],
      light: pink[300],
      dark: pink[400],
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
});

// Minimal Theme - Clean and subtle
const minimalTheme = createTheme({
  palette: {
    primary: {
      main: "#333333",
      light: "#666666",
      dark: "#000000",
    },
    secondary: {
      main: "#cccccc",
      light: "#eeeeee",
      dark: "#999999",
    },
    background: {
      default: "#ffffff",
      paper: "#fafafa",
    },
  },
  typography: {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={minimalTheme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
