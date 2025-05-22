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
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import { Icon } from "leaflet";

import marker from "../../assets/red-pin.png";
import { LocationContext } from "../../location/location-context";

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

export default function LocationPicker({ name, label, disabled = false }: any) {
  const { location } = useContext(LocationContext);
  const [field, meta, helpers] = useField(name);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(field.value || location);
  const [address, setAddress] = useState("");
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSaveOfPickedLocation = useCallback(async () => {
    const addr = await reverseGeocodeOSM(
      pickedLocation.lat,
      pickedLocation.lng,
    );
    helpers.setValue(pickedLocation);
    helpers.setTouched(false);
    setAddress(addr);
    setMapDialogOpen(false);
  }, [pickedLocation, helpers, setAddress, setMapDialogOpen]);

  useEffect(() => {
    handleSaveOfPickedLocation();
  }, [handleSaveOfPickedLocation]);

  // Component that shows a marker in selected location
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (!disabled) {
          setPickedLocation(e.latlng as any);
        }
      },
    });

    return <Marker icon={myIcon} position={pickedLocation} />;
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
          onClick={() => !disabled && setMapDialogOpen(true)}
          sx={{
            position: "relative",
            pt: label ? 2.5 : 0,
            pb: 0.5,
            borderBottom: 1,
            borderColor: showError ? "error.main" : "text.primary",
            cursor: disabled ? "not-allowed" : "pointer",
            pointerEvents: disabled ? "none" : "auto",
          }}
        >
          <input
            id={`location-picker-${name}`}
            disabled={disabled}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: disabled
                ? "text.disabled"
                : showError
                  ? "error.main"
                  : "text.primary",
              px: 0,
            }}
          >
            {`[${pickedLocation.lat}, ${pickedLocation.lng}]`}
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
              center={[pickedLocation.lat, pickedLocation.lng]} // Default center
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </Box>
          <Box
            p={2}
            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
            display="flex"
            justifyContent="flex-end"
            gap={1}
          >
            <Button onClick={() => setMapDialogOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleSaveOfPickedLocation}
              variant="contained"
              disabled={disabled}
            >
              {t("Save location")}
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
}
