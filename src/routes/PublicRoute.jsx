import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";


const PublicRoute = () => {
  // Use the context to get the current user (or authentication status)
  const  token  = localStorage.getItem("jwtToken");

  // If a user is logged in, redirect them to the dashboard route
  if (token) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // Otherwise, render the public route's child components
  return <Outlet />;
};

export default PublicRoute;
