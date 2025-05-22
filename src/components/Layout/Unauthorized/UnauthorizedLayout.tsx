import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../../authentication/auth-context";
import { Box } from "@mui/material";
import { useLottie } from "lottie-react";
import animation from "../../../assets/animation.json";
import { LanguageMenu } from "../../Settings/LanguageMenu";
import ThemeSwitch from "../../Settings/ThemeSwitch";

export default function UnauthorizedLayout() {
  const { isLoggedIn } = useContext(AuthContext);
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
      <Box sx={{ position: "absolute", top: 4, right: 4 }}>
        <LanguageMenu />
        <ThemeSwitch />
      </Box>
      <Box
        sx={{
          height: "100vh",
          flex: 2,
          backgroundColor: "background.default",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
