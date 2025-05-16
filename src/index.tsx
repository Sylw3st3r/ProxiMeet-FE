import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./translations/i18n";
import AuthProvider from "./authentication/AuthProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider
        theme={createTheme({
          colorSchemes: {
            dark: true,
          },
        })}
      >
        <SnackbarProvider autoHideDuration={4000}>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
