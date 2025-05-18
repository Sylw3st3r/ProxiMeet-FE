import React, { useContext, useEffect } from "react";
import { AuthContext } from "../authentication/auth-context";
import axios from "axios";

export default function AxiosInterceptor({ children }: any) {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const targetUrl = "http://localhost:3001/events";

      if (config.url?.startsWith(targetUrl) && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  return children;
}
