import { useEffect, useState } from "react";
import { useCallback } from "react";
import { AuthContext } from "./auth-context";

export const defaultAuthenticationContext = {
  firstName: null,
  lastName: null,
  email: null,
  token: null,
  isLoggedIn: false,
  expirationDate: null,
  setUserData: () => {},
  logout: () => {},
};

let logoutTimer = null;

export default function AuthProvider({ children }) {
  const [context, setContext] = useState({
    ...defaultAuthenticationContext,
  });
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const setUserData = useCallback((newContext) => {
    const expirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(expirationDate);
    setContext((oldContext) => {
      const newUserData = {
        ...oldContext,
        ...newContext,
        expirationDate: expirationDate.toISOString(),
        isLoggedIn: true,
      };
      localStorage.setItem("userData", JSON.stringify(newUserData));
      return newUserData;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("userData");
    setContext(defaultAuthenticationContext);
  }, []);

  useEffect(() => {
    if (context.token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [context, tokenExpirationDate]);

  useEffect(() => {
    (async function () {
      if (localStorage.getItem("userData")) {
        const data = localStorage.getItem("userData");
        const parsedData = await JSON.parse(data);
        const timer = new Date(parsedData.expirationDate);
        if (timer.getTime() > new Date()) {
          setContext(parsedData);
          setTokenExpirationDate(timer);
        } else {
          localStorage.removeItem("userData");
        }
      } else {
        setContext(defaultAuthenticationContext);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...context,
        setUserData: setUserData,
        logout: logout,
        dataLoading: !!localStorage.getItem("userData") && !context.isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
