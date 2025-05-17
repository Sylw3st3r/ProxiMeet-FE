import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./translations/i18n";
import AuthProvider from "./authentication/AuthProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

export const client = new QueryClient();

root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={client}>
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
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
);
