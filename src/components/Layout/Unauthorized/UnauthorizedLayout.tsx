import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../../authentication/auth-context";
import { Box, useColorScheme } from "@mui/material";
import { useLottie } from "lottie-react";
import animation from "../../../assets/animation.json";

import { Switch } from "@mui/material";

export default function UnauthorizedLayout() {
  const { isLoggedIn } = useContext(AuthContext);
  const { mode, setMode } = useColorScheme();
  const { View } = useLottie({
    loop: true,
    animationData: animation,
  });

  // Layout for when user is unauthorized. If user is authorized the we redirect to "/dashboard"
  return isLoggedIn ? (
    <Navigate to="/dashboard" />
  ) : (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "row" }}>
      <Box
        sx={{
          height: "100vh",
          flex: 1,
          display: "flex",
          backgroundColor: "background.default",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "primary.light",
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
          backgroundColor: "background.default",
        }}
      >
        <Switch
          sx={{ position: "absolute", right: 4, top: 4 }}
          value={mode === "light" ? "dark" : "light"}
          onClick={() => {
            setMode(mode === "light" ? "dark" : "light");
          }}
        />
        <Outlet />
      </Box>
    </Box>
  );
}
