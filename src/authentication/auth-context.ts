import { createContext } from "react";

export const AuthContext = createContext({
  dataLoading: false,
  isLoggedIn: false,
  expirationDate: null,
  firstName: null,
  lastName: null,
  email: null,
  token: null,
  role: null,
  setUserData: (a: any) => {},
  logout: () => {},
});
