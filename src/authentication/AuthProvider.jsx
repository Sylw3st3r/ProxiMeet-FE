import { useEffect, useState, useCallback, useRef } from "react";
import { AuthContext } from "./auth-context";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export const defaultAuthenticationContext = {
  firstName: null,
  lastName: null,
  email: null,
  token: null,
  isLoggedIn: false,
  refreshToken: null,
  refreshTokenExpirationDate: null,
};

export default function AuthProvider({ children }) {
  const [
    {
      firstName,
      lastName,
      email,
      token,
      isLoggedIn,
      refreshToken,
      refreshTokenExpirationDate,
    },
    setContext,
  ] = useState({ ...defaultAuthenticationContext });

  // Refs for timers
  const logoutTimer = useRef(null);
  const refreshInterval = useRef(null);

  // Request for new access token
  const { mutate: refreshTokenRequest } = useMutation({
    mutationFn: async (refreshToken) => {
      const response = await axios.post("http://localhost:3001/users/token", {
        refreshToken,
      });
      return response.data.token;
    },
    onSuccess: (newToken) => {
      setContext((oldContext) => ({ ...oldContext, token: newToken }));
    },
    onError: () => {
      logOut();
    },
  });

  const { mutate: logoutRequest } = useMutation({
    mutationFn: async (refreshToken) => {
      return axios.post("http://localhost:3001/users/logout", {
        refreshToken,
      });
    },
  });

  const logIn = useCallback((newContext) => {
    // Set expiration date for refresh token (token expires in 7 days since being created)
    const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const newUserData = {
      ...newContext,
      refreshTokenExpirationDate: expirationDate.toISOString(),
      isLoggedIn: true,
    };

    setContext(newUserData);
    localStorage.setItem("userData", JSON.stringify(newUserData));
  }, []);

  // Clear local memory / reset context / and send request to BE to get rid of old refresh token
  const logOut = useCallback(() => {
    localStorage.removeItem("userData");
    logoutRequest(refreshToken);
    setContext(defaultAuthenticationContext);
  }, [refreshToken]);

  useEffect(() => {
    if (refreshTokenExpirationDate) {
      const remainingTime =
        new Date(refreshTokenExpirationDate).getTime() - Date.now();
      // Schedule logout
      logoutTimer.current = setTimeout(logOut, remainingTime);
      // Requesting new access token every 5 minutes before the old one expires
      refreshInterval.current = setInterval(
        () => {
          if (refreshToken) {
            refreshTokenRequest(refreshToken);
          }
        },
        10 * 60 * 1000,
      ); // 5 minutes

      // Cleanup of timers/intervals
      return () => {
        if (logoutTimer.current) {
          clearTimeout(logoutTimer.current);
          logoutTimer.current = null;
        }
        if (refreshInterval.current) {
          clearInterval(refreshInterval.current);
          refreshInterval.current = null;
        }
      };
    }
  }, [refreshTokenExpirationDate, refreshToken, refreshTokenRequest, logOut]);

  // On mount parse user data from local storage and check if still valid to use
  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      const parsedData = JSON.parse(data);
      const expiration = new Date(parsedData.refreshTokenExpirationDate);
      // Check if refresh token is still valid
      if (expiration.getTime() > Date.now()) {
        setContext(parsedData);
        if (parsedData.refreshToken) {
          // Request new access token
          refreshTokenRequest(parsedData.refreshToken);
        }
      } else {
        logOut();
      }
    }
  }, [refreshTokenRequest, logOut]);

  return (
    <AuthContext.Provider
      value={{
        firstName,
        lastName,
        email,
        token,
        refreshToken,
        refreshTokenExpirationDate,
        isLoggedIn,
        logIn,
        logOut,
        dataLoading: !!localStorage.getItem("userData") && !isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
