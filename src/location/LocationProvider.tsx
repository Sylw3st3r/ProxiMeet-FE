import { useContext, useEffect, useState } from "react";
import { LocationContext } from "./location-context";
import { AuthContext } from "../authentication/auth-context";

export default function LocationProvider({ children }: any) {
  const [location, setLocation] = useState<null | {
    lat: number;
    lng: number;
  }>(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [requestingLocation, setRequestingLocation] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    if (!navigator.geolocation) {
      return;
    }

    setRequestingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setRequestingLocation(false);
      },
      () => {
        setRequestingLocation(false);
      },
    );
  }, [isLoggedIn]);

  return (
    <LocationContext.Provider value={{ location, requestingLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
