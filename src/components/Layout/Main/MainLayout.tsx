import React, { useContext, useEffect } from "react";
import { Link, Navigate, Outlet, useNavigation } from "react-router";
import { AuthContext } from "../../../authentication/auth-context";
import { Box, Button, LinearProgress, useTheme } from "@mui/material";
import SidebarNav from "./Sidebar";

export default function MainLayout() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const theme = useTheme();

  // useEffect(() => {
  //   if (navigation.state === 'loading') {
  //     nprogress.start();
  //   } else {
  //     nprogress.done();
  //   }
  // }, [navigation.state]);

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
        {navigation.state === "loading" && <LinearProgress />}
        <Outlet />
      </Box>
    </Box>
  ) : (
    <Navigate to="/" />
  );
}
