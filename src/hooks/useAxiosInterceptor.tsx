import { useEffect, useState } from "react";
import axios from "axios";

export default function useAxiosInterceptor(token: string | null) {
  const [interceptorReady, setInterceptorReady] = useState(false);

  useEffect(() => {
    if (token) {
      const requestInterceptor = axios.interceptors.request.use((config) => {
        const targetUrls = [
          "http://localhost:3001/events",
          "http://localhost:3001/notifications",
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
