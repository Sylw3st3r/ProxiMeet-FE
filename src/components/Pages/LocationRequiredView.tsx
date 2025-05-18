import React, { useContext } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { LocationContext } from "../../location/location-context";
import { AuthContext } from "../../authentication/auth-context";

export default function LocationRequiredView() {
  const { requestingLocation } = useContext(LocationContext);
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          overflow: "auto",
          maxHeight: "80vh",
          maxWidth: 800,
        }}
      >
        <Box
          display="flex"
          justifyContent={"center"}
          alignItems="center"
          mb={2}
        >
          <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            {t("Welcome to the ProxiMeet")}
          </Typography>
          <Box flex={1}></Box>
          {!requestingLocation && <Button onClick={logout}>Logout</Button>}
        </Box>

        {requestingLocation ? (
          <Box>
            <LinearProgress></LinearProgress>
            <Typography mt={2}>Waiting for your location</Typography>
          </Box>
        ) : (
          <Typography sx={{ overflow: "auto" }} variant="body1" gutterBottom>
            <Typography variant="h6" gutterBottom>
              How to enable location access in your browser
            </Typography>

            {/* Chrome Desktop */}
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
              Google Chrome (Desktop)
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Look for a padlock 🔒 icon near the URL bar. If you don’t see one, click the three dots menu (⋮) → Settings → Privacy and security → Site Settings → Location." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Find your website under Blocked or Denied sites." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Change location permission to Allow." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Reload the page." />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Firefox Desktop */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Mozilla Firefox (Desktop)
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Click the lock 🔒 icon left of the URL." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Click the arrow or More Information." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Under Permissions, find 'Access Your Location'." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Change to 'Allow'." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Refresh the page." />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Safari Desktop */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Safari (macOS)
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Go to Safari → Preferences → Websites tab." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Select 'Location' on the sidebar." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Find your website and set permission to 'Allow'." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Refresh the page." />
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Summary */}
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Summary:</strong> Click the padlock 🔒 icon near the URL,
              find Location permissions, change to Allow, then refresh the page.
            </Typography>
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
