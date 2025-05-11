import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../../authentication/auth-context";
import { Box, useTheme } from "@mui/material";
import { useLottie } from "lottie-react";
import animation from "../../../assets/animation.json";

export default function UnauthorizedLayout() {
  const { isLoggedIn } = useContext(AuthContext);
  const theme = useTheme();
  const { View } = useLottie({
    loop: true,
    animationData: animation,
  });

  // Layout hor when user is unauthorized. If user is authorized the we redirect to "/dashboard"
  return isLoggedIn ? (
    <Navigate to="/dashboard" />
  ) : (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "row" }}>
      <Box
        sx={{
          height: "100vh",
          flex: 1,
          display: "flex",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.primary.light,
            m: 2,
            borderRadius: 4,
          }}
        >
          {View}
        </Box>
      </Box>
      <Box
        sx={{
          height: "100vh",
          flex: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
