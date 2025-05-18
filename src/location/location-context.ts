import { createContext } from "react";

export const LocationContext = createContext<{
  location: { lat: number; lng: number } | null;
  requestingLocation: boolean;
}>({
  location: null,
  requestingLocation: false,
});
