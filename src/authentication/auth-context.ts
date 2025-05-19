import { createContext } from "react";

export const AuthContext = createContext({
  dataLoading: false,
  isLoggedIn: false,
  firstName: null,
  lastName: null,
  email: null,
  token: null,
  refreshToken: null,
  refreshTokenExpirationDate: null,
  role: null,
  logIn: (a: any) => {},
  logOut: () => {},
});
