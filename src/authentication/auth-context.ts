import { createContext } from "react";

export const AuthContext = createContext<{
  id: null | number;
  firstName: null | string;
  lastName: null | string;
  email: null | string;
  token: null | string;
  refreshToken: null | string;
  refreshTokenExpirationDate: null | string;
  logIn: (userData: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    refreshToken: string;
  }) => void;
  logOut: () => void;
}>({
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  token: null,
  refreshToken: null,
  refreshTokenExpirationDate: null,
  logIn: () => {},
  logOut: () => {},
});
