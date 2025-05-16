import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../../authentication/auth-context";
import { Box, useTheme } from "@mui/material";
import SidebarNav from "./Sidebar";

export default function MainLayout() {
  const { isLoggedIn } = useContext(AuthContext);
  const theme = useTheme();

  // Layout with sidenav. If user hasnt sign in the we redirect to "/"
  return isLoggedIn ? (
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
  ) : (
    <Navigate to="/" />
  );
}
