import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Link
} from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import  PaymentWrapper from "../components/checkoutForm"
import TasksUI from "../pages/TasksPage";


const Routes = () => {
  // Routes accessible only to authenticated users
  const authenticatedRoutes = {
    path: "/app", // using a sub-path (e.g., /app) for protected routes
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element:  <TasksUI/>, // Dashboard page for authenticated users
      },
      {
        path: "payment",
        element: <PaymentWrapper/>, 
      },
      
    ],
  };

  // Routes accessible to all users
  const publicRoutes = {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "/",
        element: <Home />,
      },
      
      {
        path: "*", // catch-all route
        element: <Home />,
      },
    ],
  };

  // Combine the routes into one array
  const routes = [publicRoutes, authenticatedRoutes];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Routes;
