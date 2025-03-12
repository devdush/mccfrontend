import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  console.log(isAuthenticated, user);
  const location = useLocation();
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "CUSTOMER") {
      return <Navigate to="/customer/dashboard" />;
    } else if (user?.role === "DRIVER") {
      return <Navigate to="/driver/dashboard" />;
    } 
     else if (user?.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" />;
    } 
    else {
      return <Navigate to="/" />;
    }
  }
  if (
    isAuthenticated &&
    user?.role !== "ADMIN" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }
  if (
    isAuthenticated &&
    user?.role === "DRIVER" &&
    location.pathname.includes("customer")
  ) {
    return <Navigate to="/driver/dashboard" />;
  }
  return <>{children}</>;
};

export default CheckAuth;
