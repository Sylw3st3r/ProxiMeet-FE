import React, { useContext } from "react";
import { AuthContext } from "../../../authentication/auth-context";
import { Typography, Paper, Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function Home() {
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        maxWidth: 800,
        margin: "auto",
        mt: 5,
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h5" fontWeight="bold">
          {t("Welcome to the ProxiMeet")}
        </Typography>
      </Box>

      <Typography variant="body1" gutterBottom>
        {t(
          "This project is a modern web application built with React and TypeScript, designed to deliver a responsive, maintainable, and scalable user interface. It incorporates Material UI for a sleek and consistent design system, while React Router handles seamless client-side routing. Internationalization is supported using i18next, enabling multi-language support and localization flexibility. The application features robust CRUD (Create, Read, Update, Delete) functionality, allowing users to manage data efficiently. Additionally, it includes authentication and authorization mechanisms to secure access. This tech stack ensures the application is well-suited for both development and production environments, emphasizing code quality, user experience, and security.",
        )}
      </Typography>
    </Paper>
  );
}
