import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../../authentication/auth-context";
import { Box, useTheme } from "@mui/material";
import SidebarNav from "./Sidebar";
import { LocationContext } from "../../../location/location-context";
import LocationRequiredView from "../../Pages/LocationRequiredView";

export default function MainLayout() {
  const { isLoggedIn } = useContext(AuthContext);
  const { location } = useContext(LocationContext);
  const theme = useTheme();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (!location) {
    return <LocationRequiredView />;
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "row" }}>
      <SidebarNav />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          flex: 1,
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
