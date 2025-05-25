import {
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
  useMemo,
} from "react";
import { AuthContext } from "./auth-context";
import { useMutation } from "@tanstack/react-query";
import {
  removeRefreshToken,
  requestNewAccessToken,
} from "../vendor/auth-vendor";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const TOKEN_EXPIRATION_DAYS = 7;

interface AuthState {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  avatar: string | null;
  refreshToken: string | null;
  refreshTokenExpirationDate: string | null;
}

const defaultAuthState: AuthState = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  refreshToken: null,
  refreshTokenExpirationDate: null,
  avatar: null,
};

function useAuthController() {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const [token, setToken] = useState<string | null>(null);

  const { mutate: logoutRequest } = useMutation({
    mutationFn: removeRefreshToken,
  });

  const logOut = useCallback(() => {
    localStorage.removeItem("userData");
    if (authState.refreshToken) logoutRequest(authState.refreshToken);
    setToken(null);
    setAuthState(defaultAuthState);
  }, [authState.refreshToken, logoutRequest]);

  const logIn = useCallback(
    ({
      id,
      firstName,
      lastName,
      email,
      token,
      refreshToken,
      avatar,
    }: Omit<AuthState, "refreshTokenExpirationDate"> & { token: string }) => {
      const expirationDate = new Date(
        Date.now() + TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
      );
      const newState: AuthState = {
        id,
        firstName,
        lastName,
        email,
        refreshToken,
        avatar,
        refreshTokenExpirationDate: expirationDate.toISOString(),
      };
      localStorage.setItem("userData", JSON.stringify(newState));
      setAuthState(newState);
      setToken(token);
    },
    [],
  );

  const updateUserData = (updatedState: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }) => {
    console.log(updateUserData);
    setAuthState((oldState) => {
      const newState = {
        ...oldState,
        ...updatedState,
      };
      localStorage.setItem("userData", JSON.stringify(newState));
      return newState;
    });
  };

  return {
    ...authState,
    token,
    logIn,
    logOut,
    setAuthState,
    setToken,
    updateUserData,
  };
}

function useAuthInitializer(
  setAuthState: (s: AuthState) => void,
  setToken: (t: string) => void,
) {
  const { mutate: refreshTokenRequest } = useMutation({
    mutationFn: requestNewAccessToken,
    onSuccess: setToken,
  });
  const { mutate: removeTokenRequest } = useMutation({
    mutationFn: removeRefreshToken,
  });

  useEffect(() => {
    const saved = localStorage.getItem("userData");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as AuthState;
      const expiration = new Date(parsed.refreshTokenExpirationDate || 0);
      if (expiration.getTime() > Date.now()) {
        setAuthState(parsed);
        refreshTokenRequest(parsed.refreshToken!);
      } else {
        removeTokenRequest(parsed.refreshToken!);
        localStorage.removeItem("userData");
        setAuthState(defaultAuthState);
      }
    } catch {
      localStorage.removeItem("userData");
    }
  }, [setAuthState, refreshTokenRequest, removeTokenRequest]);
}

function useAuthTokenRefresh(
  refreshToken: string | null,
  refreshTokenExpirationDate: string | null,
  setToken: (t: string | null) => void,
  logOut: () => void,
) {
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  const { mutate: refreshAccessToken } = useMutation({
    mutationFn: requestNewAccessToken,
    onSuccess: setToken,
    onError: logOut,
  });

  useEffect(() => {
    if (!refreshToken || !refreshTokenExpirationDate) return;

    const expiration = new Date(refreshTokenExpirationDate).getTime();
    const timeUntilLogout = expiration - Date.now();

    logoutTimer.current = setTimeout(logOut, timeUntilLogout);
    refreshInterval.current = setInterval(
      () => refreshAccessToken(refreshToken),
      REFRESH_INTERVAL_MS,
    );

    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [refreshToken, refreshTokenExpirationDate, refreshAccessToken, logOut]);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const {
    id,
    firstName,
    lastName,
    email,
    token,
    avatar,
    refreshToken,
    refreshTokenExpirationDate,
    logIn,
    logOut,
    setAuthState,
    setToken,
    updateUserData,
  } = useAuthController();

  useAuthInitializer(setAuthState, setToken);
  useAuthTokenRefresh(
    refreshToken,
    refreshTokenExpirationDate,
    setToken,
    logOut,
  );

  const dataLoading = useMemo(
    () => !!localStorage.getItem("userData") && !refreshToken,
    [refreshToken],
  );

  return (
    <AuthContext.Provider
      value={{
        id,
        firstName,
        lastName,
        email,
        token,
        avatar,
        refreshToken,
        refreshTokenExpirationDate,
        logIn,
        logOut,
        updateUserData,
      }}
    >
      {!dataLoading && children}
    </AuthContext.Provider>
  );
}
