import React from "react";
import AuthProvider from "./authentication/AuthProvider";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router";
import MainLayout from "./components/Layout/Main/MainLayout";
import Home from "./components/Pages/Home/Home";
import SignIn from "./components/Pages/SignIn/SignIn";
import UnauthorizedLayout from "./components/Layout/Unauthorized/UnauthorizedLayout";
import PageNotFound from "./components/Pages/PageNotFound/PageNotFund";
import Loading from "./components/Layout/Loading/Loading";
import SignUp from "./components/Pages/SignUp/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Loading,
    children: [
      {
        path: "/dashboard",
        Component: MainLayout,
        children: [
          { index: true, Component: Home },
          { path: "home", Component: Home, loader: () => console.log("AAA") },
        ],
      },
      {
        path: "/",
        Component: UnauthorizedLayout,
        children: [
          { index: true, Component: SignIn },
          {
            path: "/signup",
            Component: SignUp,
          },
        ],
      },
      {
        path: "/*",
        Component: PageNotFound,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
