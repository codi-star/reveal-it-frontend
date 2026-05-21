import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminFeedbackPage } from "./pages/AdminFeedbackPage";
import { HistoryPage } from "./pages/HistoryPage";
import { RootLayout } from "./layouts/RootLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

function AdminOnly({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem("userRole") === "admin";

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Navigate to="/login" replace />,

    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },

      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "home",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },

      {
        path: "about",
        element: (
          <ProtectedRoute>
            <AboutPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "contact",
        element: (
          <ProtectedRoute>
            <ContactPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "history",
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "feedback",
        element: (
          <ProtectedRoute>
            <AdminOnly>
              <AdminFeedbackPage />
            </AdminOnly>
          </ProtectedRoute>
        ),
      },

      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
]);
