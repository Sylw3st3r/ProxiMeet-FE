import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../authentication/auth-context";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  Typography,
  useTheme,
  Toolbar,
  Select,
  MenuItem,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvent,
} from "react-leaflet";

import { Icon } from "leaflet";

import marker from "../../../assets/red-pin.png";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
const myIcon = new Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  iconSize: [25, 40],
  iconAnchor: [12.5, 40],
  popupAnchor: [0, -40],
});

export function CustomPopup({ name, image, description }) {
  return (
    <Popup>
      <div style={{ margin: 0 }}>
        <Card sx={{ width: 240, p: 0 }}>
          <CardMedia
            component="img"
            image={`http://localhost:3001/images/${image}`}
            alt={name}
            sx={{
              aspectRatio: "16/9",
              objectFit: "cover",
            }}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Popup>
  );
}

const KM_TO_M = 1000;
const MILES_TO_M = 1609.34;

const getData = async (signal, lat, lng, radius, unit, token) => {
  const response = await axios.get(
    `http://localhost:3001/events/near?lat=${lat}&lng=${lng}&radius=${radius}&unit=${unit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    },
  );

  return response.data.events;
};

export default function NearYou() {
  const { token } = useContext(AuthContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [radius, setRadius] = useState(50);
  const [unit, setUnit] = useState("km");
  const [location, setLocation] = useState(null);
  const theme = useTheme();

  const { data } = useQuery({
    queryKey: ["near-events", { radius, unit, location }],
    queryFn: ({ signal }) =>
      getData(signal, location.lat, location.lng, radius, unit, token),
    enabled: location !== null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  // Component that shows a marker in selected location
  const LocationMarker = () => {
    useMapEvent({
      click(e) {
        setLocation(e.latlng);
      },
    });

    return location ? <Marker icon={myIcon} position={location} /> : null;
  };

  return location ? (
    <Box
      flexDirection={"column"}
      style={{ height: "100vh", width: "100%", display: "flex" }}
    >
      <Toolbar
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: 200,
          bgcolor: theme.palette.background.paper,
          flexWrap: "wrap",
        }}
      >
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
          <MenuItem value={"km"}>Kilometers</MenuItem>
          <MenuItem value={"mi"}>Miles</MenuItem>
        </Select>
      </Toolbar>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={9}
        style={{ flex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Circle
          center={[location.lat, location.lng]}
          radius={radius * (unit === "km" ? KM_TO_M : MILES_TO_M)}
          pathOptions={{ color: theme.palette.primary, fillOpacity: 0.2 }}
        />
        <LocationMarker />
        {(data || []).map((event) => {
          return (
            <Marker
              eventHandlers={{ click: () => setSelectedEvent(event) }}
              key={event.id}
              position={[event.lat, event.lng]}
            ></Marker>
          );
        })}
      </MapContainer>
      {selectedEvent ? (
        <Dialog open={true} onClose={() => setSelectedEvent(null)}>
          <Card sx={{ width: 400 }}>
            <CardMedia
              component="img"
              image={`http://localhost:3001/images/${selectedEvent.image}`}
              alt={selectedEvent.name}
              sx={{
                aspectRatio: "16/9",
                objectFit: "cover",
              }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedEvent.description}
              </Typography>
            </CardContent>
          </Card>
        </Dialog>
      ) : null}
    </Box>
  ) : (
    <Typography>No location</Typography>
  );
}
