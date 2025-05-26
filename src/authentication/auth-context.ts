import { createContext } from "react";

export const AuthContext = createContext<{
  id: null | number;
  firstName: null | string;
  lastName: null | string;
  email: null | string;
  avatar: null | string;
  token: null | string;
  logIn: (userData: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    avatar: null | string;
  }) => void;
  updateUserData: (userData: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }) => void;
  logOut: () => void;
}>({
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  token: null,
  avatar: null,
  logIn: () => {},
  logOut: () => {},
  updateUserData: () => {},
});
