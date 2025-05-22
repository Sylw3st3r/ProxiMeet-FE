import { createContext } from "react";

export const AuthContext = createContext<{
  dataLoading: boolean;
  isLoggedIn: boolean;
  firstName: null | string;
  lastName: null | string;
  email: null | string;
  token: null | string;
  refreshToken: null | string;
  refreshTokenExpirationDate: null | string;
  logIn: (userData: any) => void;
  logOut: () => void;
}>({
  dataLoading: false,
  isLoggedIn: false,
  firstName: null,
  lastName: null,
  email: null,
  token: null,
  refreshToken: null,
  refreshTokenExpirationDate: null,
  logIn: (userData) => {},
  logOut: () => {},
});
