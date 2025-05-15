import {
  Box,
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useField } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import { Icon } from "leaflet";

import marker from "../../assets/red-pin.png";

const myIcon = new Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  iconSize: [25, 40],
  iconAnchor: [12.5, 40],
  popupAnchor: [0, -40],
});

export async function reverseGeocodeOSM(lat: number, lon: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
  );
  const data = await response.json();
  if (data && data.display_name) {
    return data.display_name;
  } else {
    throw new Error("No address found.");
  }
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function LocationPicker({ name, label }: any) {
  const [field, meta, helpers] = useField(name);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [location, setLocation] = useState(field.value || null);
  const [address, setAddress] = useState("");
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const userLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        const addr = await reverseGeocodeOSM(userLoc.lat, userLoc.lng);
        setLocation(userLoc);
        helpers.setValue(userLoc);
        setAddress(addr);
      });
    }
  }, []);

  const handleSaveOfPickedLocation = useCallback(async () => {
    if (location) {
      const addr = await reverseGeocodeOSM(location.lat, location.lng);
      helpers.setValue(location);
      helpers.setTouched(false);
      setAddress(addr);
    }
    setMapDialogOpen(false);
  }, [location]);

  // Component that shows a marker in selected location
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLocation(e.latlng as any);
      },
    });

    return location ? <Marker icon={myIcon} position={location} /> : null;
  };

  const showError = Boolean(meta.error && meta.touched);

  return (
    <>
      <FormControl fullWidth error={showError} variant="standard">
        {label && (
          <InputLabel
            shrink
            htmlFor={`location-picker-${name}`}
            sx={{ pointerEvents: "none" }} // prevent label blocking clicks
          >
            {label}
          </InputLabel>
        )}

        <Box
          onClick={() => setMapDialogOpen(true)}
          sx={{
            position: "relative",
            pt: label ? 2.5 : 0,
            pb: 0.5,
            borderBottom: 1,
            borderColor: showError ? "error.main" : "text.primary",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <input
            id={`location-picker-${name}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: showError ? "error.main" : "text.primary",
              px: 0,
            }}
          >
            {location
              ? `[${location.lat}, ${location.lng}]`
              : t("Drag 'n' drop an image here, or click to select")}
          </Typography>
        </Box>

        {showError && <FormHelperText>{meta.error}</FormHelperText>}
      </FormControl>
      {address && (
        <TextField
          multiline
          label={"location.address"}
          disabled={true}
          value={address}
          variant="standard"
        />
      )}

      {/* Map Dialog */}
      {location && (
        <Dialog open={mapDialogOpen} fullWidth maxWidth="sm">
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 400,
              bgcolor: "black",
            }}
          >
            <MapContainer
              center={[location.lat, location.lng]} // Default center
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker></LocationMarker>
            </MapContainer>
          </Box>
          <Box
            p={2}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
            display="flex"
            justifyContent="flex-end"
            gap={1}
          >
            <Button onClick={() => setMapDialogOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleSaveOfPickedLocation} variant="contained">
              {t("Save location")}
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
}
