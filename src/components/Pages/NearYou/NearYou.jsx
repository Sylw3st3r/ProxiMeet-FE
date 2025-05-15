import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../authentication/auth-context";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
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

export default function NearYou() {
  const { token } = useContext(AuthContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError(`Error: ${err.message}`);
      },
    );
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/events/near?lat=${location.lat}&lng=${location.lng}&radius=${50}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEvents(response.data.events);
    } catch {}
  };

  useEffect(() => {
    if (location) {
      getData();
    }
  }, [location]);

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
    <>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={9}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Circle
          center={[location.lat, location.lng]}
          radius={50000} // 50 kilometers in meters
          pathOptions={{ color: "#578dd4", fillOpacity: 0.2 }}
        />
        <LocationMarker />
        {events.map((event) => {
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
    </>
  ) : (
    <Typography>No location</Typography>
  );
}
