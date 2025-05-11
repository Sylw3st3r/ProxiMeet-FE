import React, { useContext } from "react";
import { Link, Navigate, Outlet } from "react-router";
import { AuthContext } from "../../../authentication/auth-context";
import { Box, Button, useTheme } from "@mui/material";

export default function MainLayout() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const theme = useTheme();

  // Layout with sidenav. If user hasnt sign in the we redirect to "/"
  return isLoggedIn ? (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "row" }}>
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            height: "100vh",
            width: "150px",
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <Link to="/"></Link>
          <Button onClick={logout}>Logout</Button>
        </Box>
      </Box>
      <Box sx={{ backgroundColor: theme.palette.background.default, flex: 1 }}>
        <Outlet />
      </Box>
    </Box>
  ) : (
    <Navigate to="/" />
  );
}
