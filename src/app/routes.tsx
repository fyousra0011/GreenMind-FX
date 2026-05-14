import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/layout/Root";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Devices } from "./pages/Devices";
import { Plants } from "./pages/Plants";
import { Alerts } from "./pages/Alerts";
import { Analytics } from "./pages/Analytics";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { GetStarted } from "./pages/GetStarted";
import { PendingApproval } from "./pages/PendingApproval";
import { BillingDetails } from "./pages/BillingDetails";
import { useApp } from "./context/AppContext";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { flowState } = useApp();
  if (flowState === "unauthenticated") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RedirectIfLoggedIn({ children }: { children: React.ReactNode }) {
  const { flowState } = useApp();
  if (flowState !== "unauthenticated") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/signin",
    element: (
      <RedirectIfLoggedIn>
        <SignIn />
      </RedirectIfLoggedIn>
    ),
  },
  {
    path: "/signup",
    element: (
      <RedirectIfLoggedIn>
        <SignUp />
      </RedirectIfLoggedIn>
    ),
  },
  {
    path: "/get-started",
    element: (
      <RequireAuth>
        <GetStarted />
      </RequireAuth>
    ),
  },
  {
    path: "/pending",
    element: (
      <RequireAuth>
        <PendingApproval />
      </RequireAuth>
    ),
  },
  {
    Component: Root,
    children: [
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/devices",
        element: (
          <RequireAuth>
            <Devices />
          </RequireAuth>
        ),
      },
      {
        path: "/plants",
        element: (
          <RequireAuth>
            <Plants />
          </RequireAuth>
        ),
      },
      {
        path: "/analytics",
        element: (
          <RequireAuth>
            <Analytics />
          </RequireAuth>
        ),
      },
      {
        path: "/alerts",
        element: (
          <RequireAuth>
            <Alerts />
          </RequireAuth>
        ),
      },
      {
        path: "/billing",
        element: (
          <RequireAuth>
            <BillingDetails />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);