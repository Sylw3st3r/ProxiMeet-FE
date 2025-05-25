import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../../authentication/auth-context";
import { Box, useTheme } from "@mui/material";
import SidebarNav from "./Sidebar";
import { LocationContext } from "../../../location/location-context";
import LocationRequiredView from "../../Pages/LocationRequiredView";
import { ChatManager } from "../../Chat/ChatManager";

export default function MainLayout() {
  const { refreshToken } = useContext(AuthContext);
  const { location } = useContext(LocationContext);
  const theme = useTheme();

  if (!refreshToken) {
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
      {/* <ChatManager /> */}
    </Box>
  );
}
