import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../authentication/auth-context";

export default function useAxiosInterceptor() {
  const [interceptorReady, setInterceptorReady] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      const requestInterceptor = axios.interceptors.request.use((config) => {
        const targetUrls = [
          "http://localhost:3001/events",
          "http://localhost:3001/notifications",
          "http://localhost:3001/profile",
        ];

        if (targetUrls.some((url) => config.url?.startsWith(url))) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      setInterceptorReady(true);

      return () => {
        axios.interceptors.request.eject(requestInterceptor);
      };
    }
  }, [token]);

  return { interceptorReady };
}
