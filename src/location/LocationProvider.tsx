import { ReactNode, useContext, useEffect, useState } from "react";
import { LocationContext } from "./location-context";
import { AuthContext } from "../authentication/auth-context";

export default function LocationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [location, setLocation] = useState<null | {
    lat: number;
    lng: number;
  }>(null);
  const { token } = useContext(AuthContext);
  const [requestingLocation, setRequestingLocation] = useState(false);

  useEffect(() => {
    // Check if user is authorized before asking for location
    if (!token) {
      setLocation(null);
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
  }, [token]);

  return (
    <LocationContext.Provider value={{ location, requestingLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
