import { useState, useCallback, ReactNode, useLayoutEffect } from "react";
import { AuthContext } from "./auth-context";
import {
  getUserData,
  removeRefreshToken,
  requestNewAccessToken,
} from "../vendor/auth-vendor";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LinearProgress } from "@mui/material";

interface AuthState {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  avatar: string | null;
}

const defaultAuthState: AuthState = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  avatar: null,
};

function useAuthController() {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const [token, setToken] = useState<string | null>(null);

  const logIn = useCallback(
    ({ token, ...user }: AuthState & { token: string }) => {
      setAuthState(user);
      setToken(token);
    },
    [],
  );

  const { mutate: logOut } = useMutation({
    mutationFn: removeRefreshToken,
    onSuccess: () => {
      setToken(null);
      setAuthState(defaultAuthState);
    },
  });

  const updateUserData = (
    updates: Partial<Pick<AuthState, "firstName" | "lastName" | "avatar">>,
  ) => setAuthState((prev) => ({ ...prev, ...updates }));

  return {
    ...authState,
    token,
    logIn,
    logOut,
    setToken,
    setAuthState,
    updateUserData,
  };
}

function useAxionsInterceptors(
  token: string | null,
  setToken: (token: string | null) => void,
) {
  useLayoutEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      config.headers.Authorization =
        !(config as any)._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response.status === 403 &&
          error.response.data.message === "Unauthorized"
        ) {
          try {
            const newToken = await requestNewAccessToken();
            console.log(newToken);
            setToken(newToken);

            originalRequest._retry = true;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return axios(originalRequest);
          } catch {
            setToken(null);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(refreshInterceptor);
    };
  }, [setToken]);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const {
    id,
    firstName,
    lastName,
    email,
    token,
    avatar,
    logIn,
    logOut,
    updateUserData,
    setToken,
    setAuthState,
  } = useAuthController();

  useAxionsInterceptors(token, setToken);

  const { isPending } = useQuery({
    queryKey: ["userData"], // Add a unique query key
    queryFn: async () => {
      const { token, ...rest } = await getUserData();
      setToken(token);
      setAuthState(rest);
      return {};
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return (
    <AuthContext.Provider
      value={{
        id,
        firstName,
        lastName,
        email,
        token,
        avatar,
        logIn,
        logOut,
        updateUserData,
      }}
    >
      {isPending ? <LinearProgress /> : children}
    </AuthContext.Provider>
  );
}
