import React, { useContext } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router";
import MainLayout from "./components/Layout/Main/MainLayout";
import Home from "./components/Pages/Home/Home";
import SignIn from "./components/Pages/SignIn/SignIn";
import PageNotFound from "./components/Pages/PageNotFound/PageNotFund";
import SignUp from "./components/Pages/SignUp/SignUp";
import { AuthContext } from "./authentication/auth-context";
import EditEventModal from "./components/Pages/Events/Forms/EditEventModal";
import UnauthorizedLayout from "./components/Layout/Unauthorized/UnauthorizedLayout";
import VerifyAccount from "./components/Pages/Verify/VerifyAccount";
import AddEventModal from "./components/Pages/Events/Forms/AddEvent";
import NearYou from "./components/Pages/NearYou/NearYou";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import UserEvents from "./components/Pages/Events/UserEvents";
import AllEvents from "./components/Pages/Events/AllEvents";
import RequestPasswordReset from "./components/Pages/RequestPasswordReset/RequestPasswordReset";
import PasswordReset from "./components/Pages/PasswordReset/PasswordReset";
import Schedule from "./components/Pages/Schedule/Schedule";
import Inbox from "./components/Pages/Inbox/Inbox";
import Profile from "./components/Pages/Profile/Profile";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const appRouter = createBrowserRouter([
  {
    path: "/dashboard",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      {
        path: "events",
        Component: AllEvents,
      },
      {
        path: "user-events",
        Component: UserEvents,
        children: [
          {
            path: "add",
            Component: AddEventModal,
          },
          {
            path: "edit/:id",
            Component: EditEventModal,
          },
        ],
      },
      {
        path: "near-you",
        Component: NearYou,
      },
      {
        path: "schedule",
        Component: Schedule,
      },
      {
        path: "inbox",
        Component: Inbox,
      },
      {
        path: "profile",
        Component: Profile,
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
      },
      {
        path: "/password-reset",
        Component: RequestPasswordReset,
      },
      {
        path: "/password-reset/:token",
        Component: PasswordReset,
      },
    ],
  },
  {
    path: "/*",
    Component: PageNotFound,
  },
]);

export default function App() {
  return <RouterProvider router={appRouter} />;
}
