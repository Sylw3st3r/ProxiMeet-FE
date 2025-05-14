import React, { Component, useContext, useMemo } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router";
import MainLayout from "./components/Layout/Main/MainLayout";
import Home from "./components/Pages/Home/Home";
import SignIn from "./components/Pages/SignIn/SignIn";
import PageNotFound from "./components/Pages/PageNotFound/PageNotFund";
import SignUp from "./components/Pages/SignUp/SignUp";
import Events from "./components/Pages/Events/Events";
import { AuthContext } from "./authentication/auth-context";
import EditEventModal from "./components/Pages/Events/Forms/EditEventModal";
import axios from "axios";
import UnauthorizedLayout from "./components/Layout/Unauthorized/UnauthorizedLayout";
import VerifyAccount from "./components/Pages/Verify/VerifyAccount";
import VerifyFaied from "./components/Pages/Verify/VerificationFailed";
import AddEventModal from "./components/Pages/Events/Forms/AddEvent";

const createRouter = (token: string | null) =>
  createBrowserRouter([
    {
      path: "/dashboard",
      Component: MainLayout,
      children: [
        { index: true, Component: Home },
        {
          path: "/dashboard/events",
          Component: Events,
          loader: async () => {
            return axios.get(`http://localhost:3001/events/all`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          },
          children: [
            {
              path: "add",
              Component: AddEventModal,
            },
            {
              path: "edit/:id",
              Component: EditEventModal,
              loader: async ({ params }) => {
                return axios.get(`http://localhost:3001/events/${params.id}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
              },
            },
          ],
        },
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
        {
          path: "/verify/:token",
          Component: VerifyAccount,
          errorElement: <VerifyFaied />,
          loader: async ({ params }) => {
            return axios.get(
              `http://localhost:3001/users/verify/${params.token}`,
            );
          },
        },
      ],
    },
    {
      path: "/*",
      Component: PageNotFound,
    },
  ]);

export default function App() {
  const { token, dataLoading } = useContext(AuthContext);

  return dataLoading ? <></> : <RouterProvider router={createRouter(token)} />;
}
