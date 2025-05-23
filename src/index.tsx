import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthProvider from "./authentication/AuthProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AxiosInterceptor from "./hooks/useAxiosInterceptor";
import LocationProvider from "./location/LocationProvider";
import TranslationProvider from "./translations/TranslationProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

export const client = new QueryClient();

root.render(
  <React.StrictMode>
    <ThemeProvider
      theme={createTheme({
        colorSchemes: {
          dark: true,
        },
      })}
    >
      <TranslationProvider>
        <SnackbarProvider autoHideDuration={4000}>
          <QueryClientProvider client={client}>
            <AuthProvider>
              <LocationProvider>
                <App />
              </LocationProvider>
            </AuthProvider>
          </QueryClientProvider>
        </SnackbarProvider>
      </TranslationProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
