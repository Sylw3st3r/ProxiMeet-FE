import React, { useContext } from "react";
import { AuthContext } from "../../../authentication/auth-context";
import { Outlet } from "react-router";
import { Box, useTheme } from "@mui/material";

export default function Loading() {
  const { dataLoading } = useContext(AuthContext);
  const theme = useTheme();

  // Guard that stops users from being redirected to "/" when the data from localStorage is still being loaded in.
  // Each time user wanted to access content he was redirected to "/" because the data hasnt had the time
  // to load in and the user was percived as unauthorized
  return dataLoading ? (
    <Box sx={{ h: "100vh", bgcolor: theme.palette.background.default }} />
  ) : (
    <Outlet />
  );
}
