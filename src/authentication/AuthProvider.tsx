import { useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { AuthContext } from "./auth-context";
import { useMutation } from "@tanstack/react-query";
import {
  removeRefreshToken,
  requestNewAccessToken,
} from "../vendor/auth-vendor";

interface AuthState {
  firstName: null | string;
  lastName: null | string;
  email: null | string;
  refreshToken: null | string;
  refreshTokenExpirationDate: null | string;
}

export const defaultAuthenticationContext = {
  firstName: null,
  lastName: null,
  email: null,
  refreshToken: null,
  refreshTokenExpirationDate: null,
};

// Hook responsible for managing the main auth state
function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>(
    defaultAuthenticationContext,
  );
  const [token, setToken] = useState<string | null>(null);

  return {
    ...authState,
    token,
    setAuthState,
    setToken,
  };
}

// Hook responsible for automatic token refresh and logout
export function useAuthTokenRefresh(
  refreshToken: string | null,
  refreshTokenExpirationDate: string | null,
  setToken: (token: string | null) => void,
  logOut: () => void,
) {
  const logoutTimer = useRef<null | NodeJS.Timeout>(null);
  const refreshInterval = useRef<null | NodeJS.Timeout>(null);

  const { mutate: refreshAccessToken } = useMutation({
    mutationFn: requestNewAccessToken,
    onSuccess: (newToken) => {
      setToken(newToken);
    },
    onError: () => {
      logOut();
    },
  });

  useEffect(() => {
    if (!refreshTokenExpirationDate || !refreshToken) return;

    const remainingTime =
      new Date(refreshTokenExpirationDate).getTime() - Date.now();

    logoutTimer.current = setTimeout(logOut, remainingTime);

    refreshInterval.current = setInterval(
      () => {
        refreshAccessToken(refreshToken);
      },
      10 * 60 * 1000,
    ); // every 10 minutes

    return () => {
      clearTimeout(logoutTimer.current!);
      clearInterval(refreshInterval.current!);
    };
  }, [refreshTokenExpirationDate, refreshToken, refreshAccessToken, logOut]);
}

// Hook responsible for loading data from localStorage and checking token expiration on mount.
export function useAuthInitializer(
  setAuthState: (state: AuthState) => void,
  setToken: (token: string) => void,
) {
  const { mutate: refreshTokenRequest } = useMutation({
    mutationFn: requestNewAccessToken,
    onSuccess: (newToken) => {
      setToken(newToken);
    },
  });

  const { mutate: removeTokenRequest } = useMutation({
    mutationFn: removeRefreshToken,
  });

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      const parsedData = JSON.parse(data);
      const expiration = new Date(parsedData.refreshTokenExpirationDate);
      if (expiration.getTime() > Date.now()) {
        setAuthState(parsedData);
        refreshTokenRequest(parsedData.refreshToken);
      } else {
        localStorage.removeItem("userData");
        removeTokenRequest(parsedData.refreshToken);
        setAuthState(defaultAuthenticationContext);
      }
    }
  }, [setAuthState, removeTokenRequest, refreshTokenRequest]);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const {
    firstName,
    lastName,
    email,
    refreshToken,
    refreshTokenExpirationDate,
    token,
    setToken,
    setAuthState,
  } = useAuthState();

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
      const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const newUserData = {
        firstName,
        lastName,
        email,
        refreshToken,
        refreshTokenExpirationDate: expirationDate.toISOString(),
      };
      setAuthState(newUserData);
      setToken(token);
      localStorage.setItem("userData", JSON.stringify(newUserData));
    },
    [setAuthState, setToken],
  );

  const logOut = useCallback(() => {
    localStorage.removeItem("userData");
    if (refreshToken) logoutRequest(refreshToken);
    setToken(null);
    setAuthState(defaultAuthenticationContext);
  }, [refreshToken, logoutRequest, setToken, setAuthState]);

  useAuthInitializer(setAuthState, setToken);
  useAuthTokenRefresh(
    refreshToken,
    refreshTokenExpirationDate,
    setToken,
    logOut,
  );

  const dataLoading = !!localStorage.getItem("userData") && !refreshToken;

  return (
    <AuthContext.Provider
      value={{
        firstName,
        lastName,
        email,
        token,
        refreshToken,
        refreshTokenExpirationDate,
        logIn,
        logOut,
      }}
    >
      {dataLoading ? undefined : children}
    </AuthContext.Provider>
  );
}
