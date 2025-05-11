import React, { useContext } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function PageNotFound() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box sx={{ p: 4, bgcolor: theme.palette.primary.light }}>
        <Typography textAlign="center" variant="h1" color="white">
          404
        </Typography>
        <Typography variant="h6" color="white">
          {t("404")}
        </Typography>
      </Box>
    </Box>
  );
}
