import { useContext, useState } from "react";
import { Box, useTheme, Select, MenuItem } from "@mui/material";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";

import { useQuery } from "@tanstack/react-query";
import { LocationContext } from "../../../location/location-context";
import { getEventsNearLocation } from "../../../vendor/events-vendor";
import { useTranslation } from "react-i18next";
import BlankToolbar from "../../Toolbar/BlankToolbar";
import { LocationMarker } from "../../Marker/LocationMarker";

const KM_TO_M = 1000;
const MILES_TO_M = 1609.34;

// Responsible for getting events within given radius
function useGetEventsWithinRadius(
  radius: number,
  unit: "km" | "mi",
  pickedLocation: { lat: number; lng: number },
) {
  const { data, isPending: eventsPending } = useQuery({
    queryKey: ["near-events", { radius, unit, pickedLocation }],
    queryFn: ({ signal }) =>
      getEventsNearLocation(
        signal,
        pickedLocation.lat,
        pickedLocation.lng,
        radius,
        unit,
      ),
  });

  return { data, eventsPending };
}

// Hook resposnsible for handling state of radius params
function useRadiusParams() {
  const { location } = useContext(LocationContext);
  const [radius, setRadius] = useState(50);
  const [unit, setUnit] = useState<"km" | "mi">("km");
  const [pickedLocation, setPickedLocation] = useState(
    location as { lat: number; lng: number },
  );

  return {
    pickedLocation,
    setPickedLocation,
    radius,
    setRadius,
    unit,
    setUnit,
  };
}

// Hook responsible for data fetching and state manipulation of NearYou component
function useNearYouControls() {
  const {
    pickedLocation,
    setPickedLocation,
    radius,
    setRadius,
    unit,
    setUnit,
  } = useRadiusParams();
  const { data, eventsPending } = useGetEventsWithinRadius(
    radius,
    unit,
    pickedLocation,
  );

  const { t } = useTranslation();

  const NearYouToolbarComponent = (
    <BlankToolbar isLoading={eventsPending}>
      <Select
        value={radius}
        onChange={(event) => {
          setRadius(event.target.value);
        }}
        autoWidth
        size="small"
      >
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
      </Select>
      <Select
        value={unit}
        onChange={(event) => {
          setUnit(event.target.value);
        }}
        autoWidth
        size="small"
      >
        <MenuItem value={"km"}>{t("units.km")}</MenuItem>
        <MenuItem value={"mi"}>{t("units.mi")}</MenuItem>
      </Select>
    </BlankToolbar>
  );

  return {
    pickedLocation,
    setPickedLocation,
    radius,
    unit,
    data,
    NearYouToolbarComponent,
  };
}

export default function NearYou() {
  const {
    radius,
    unit,
    pickedLocation,
    setPickedLocation,
    data,
    NearYouToolbarComponent,
  } = useNearYouControls();
  const theme = useTheme();

  return (
    <Box
      flexDirection={"column"}
      style={{ height: "100vh", width: "100%", display: "flex" }}
    >
      {NearYouToolbarComponent}
      <MapContainer
        center={[pickedLocation.lat, pickedLocation.lng]}
        zoom={9}
        style={{ flex: 1, zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Circle
          center={[pickedLocation.lat, pickedLocation.lng]}
          radius={radius * (unit === "km" ? KM_TO_M : MILES_TO_M)}
          pathOptions={{ color: theme.palette.primary.main, fillOpacity: 0.2 }}
        />
        <LocationMarker
          pickedLocation={pickedLocation}
          setPickedLocation={setPickedLocation}
        />
        {(data || []).map((event) => {
          return (
            <Marker
              // eventHandlers={{ click: () => setSelectedEvent(event) }}
              key={event.id}
              position={[event.lat, event.lng]}
            ></Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
}
