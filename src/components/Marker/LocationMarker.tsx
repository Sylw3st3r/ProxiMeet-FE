import { Marker, useMapEvent } from "react-leaflet";
import { Icon } from "leaflet";

import marker from "../../assets/red-pin.png";

const myIcon = new Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  iconSize: [25, 40],
  iconAnchor: [12.5, 40],
  popupAnchor: [0, -40],
});

export function LocationMarker({
  pickedLocation,
  setPickedLocation,
}: {
  pickedLocation: { lat: number; lng: number };
  setPickedLocation: (location: { lat: number; lng: number }) => void;
}) {
  useMapEvent("click", (e: { latlng: { lat: number; lng: number } }) => {
    setPickedLocation(e.latlng);
  });

  return <Marker icon={myIcon} position={pickedLocation} />;
}
