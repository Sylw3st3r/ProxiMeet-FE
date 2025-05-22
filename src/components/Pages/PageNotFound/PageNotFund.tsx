import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        textAlign: "center",
        pt: 10,
        bgcolor: "background.default",
        height: "100vh",
      }}
    >
      <Typography variant="h1" component="div" color="primary" gutterBottom>
        {t("404[0]")}
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {t("404[1]")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t("404[2]")}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        {t("common.goHome")}
      </Button>
    </Box>
  );
};

export default PageNotFound;
