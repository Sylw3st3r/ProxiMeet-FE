import { Typography, Paper, Box, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function Home() {
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
          {t("home.welcome")}
        </Typography>
      </Box>

      <Typography variant="body1" gutterBottom>
        {t("home.description")}
      </Typography>
    </Paper>
  );
}
