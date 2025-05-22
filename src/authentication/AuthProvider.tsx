import { useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { AuthContext } from "./auth-context";
import { useMutation } from "@tanstack/react-query";
import {
  removeRefreshToken,
  requestNewAccessToken,
} from "../vendor/auth-vendor";

export const defaultAuthenticationContext = {
  firstName: null,
  lastName: null,
  email: null,
  refreshToken: null,
  refreshTokenExpirationDate: null,
  isLoggedIn: false,
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [
    {
      firstName,
      lastName,
      email,
      refreshToken,
      isLoggedIn,
      refreshTokenExpirationDate,
    },
    setContext,
  ] = useState<{
    firstName: null | string;
    lastName: null | string;
    email: null | string;
    refreshToken: null | string;
    refreshTokenExpirationDate: null | string;
    isLoggedIn: boolean;
  }>({ ...defaultAuthenticationContext });
  const [token, setToken] = useState<string | null>(null);

  // Refs for timers
  const logoutTimer = useRef<null | NodeJS.Timeout>(null);
  const refreshInterval = useRef<null | NodeJS.Timer>(null);

  // Request for new access token
  const { mutate: refreshAccessTokenRequest } = useMutation({
    mutationFn: requestNewAccessToken,
    onSuccess: (newToken) => {
      setToken(newToken);
    },
    onError: () => {
      logOut();
    },
  });

  const { mutate: logoutRequest } = useMutation({
    mutationFn: removeRefreshToken,
  });

  const logIn = useCallback(
    ({
      firstName,
      lastName,
      email,
      token,
      refreshToken,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      token: string;
      refreshToken: string;
    }) => {
      // Set expiration date for refresh token (token expires in 7 days since being created)
      const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const newUserData = {
        firstName,
        lastName,
        email,
        refreshToken,
        isLoggedIn: true,
        refreshTokenExpirationDate: expirationDate.toISOString(),
      };

      setContext(newUserData);
      setToken(token);
      localStorage.setItem("userData", JSON.stringify(newUserData));
    },
    [setContext, setToken],
  );

  // Clear local memory / reset context / and send request to BE to get rid of old refresh token
  const logOut = useCallback(() => {
    localStorage.removeItem("userData");
    if (refreshToken) {
      logoutRequest(refreshToken);
    }
    setToken(null);
    setContext(defaultAuthenticationContext);
  }, [refreshToken, logoutRequest]);

  useEffect(() => {
    if (refreshTokenExpirationDate) {
      const remainingTime =
        new Date(refreshTokenExpirationDate).getTime() - Date.now();
      // Schedule logout
      logoutTimer.current = setTimeout(logOut, remainingTime);
      // Requesting new access token every 10 minutes before the old one expires
      refreshInterval.current = setInterval(
        () => {
          if (refreshToken) {
            refreshAccessTokenRequest(refreshToken);
          }
        },
        10 * 60 * 1000,
      ); // 10 minutes

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
  }, [
    refreshTokenExpirationDate,
    refreshToken,
    refreshAccessTokenRequest,
    logOut,
  ]);

  // On mount parse user data from local storage and check if still valid to use
  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      const parsedData = JSON.parse(data);
      const expiration = new Date(parsedData.refreshTokenExpirationDate);
      // Check if refresh token is still valid
      if (expiration.getTime() > Date.now()) {
        setContext(parsedData);
        // Request new access token
        refreshAccessTokenRequest(parsedData.refreshToken);
      } else {
        localStorage.removeItem("userData");
        logoutRequest(parsedData.refreshToken);
        setContext(defaultAuthenticationContext);
      }
    }
  }, [refreshAccessTokenRequest, logoutRequest]);

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
        dataLoading:
          (!!localStorage.getItem("userData") && !isLoggedIn) ||
          (isLoggedIn && !token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
