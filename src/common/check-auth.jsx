import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();
  console.log(location.pathname);
  console.log(isAuthenticated);
  console.log(user);
  if (!isAuthenticated && !["/login", "/register"].includes(location.pathname)) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && ["/login", "/register"].includes(location.pathname)) {
    const from = location.state?.from?.pathname || "/";

    if (user?.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === "CUSTOMER") {
      return <Navigate to="/customer/dashboard" replace />;
    } else if (user?.role === "DRIVER") {
      return <Navigate to="/driver/dashboard" replace />;
    } else {
      return <Navigate to={from} replace />;
    }
  }

  if (isAuthenticated) {
    if (user?.role === "CUSTOMER" && location.pathname.includes("/admin")) {
      return <Navigate to="/customer/dashboard" replace />;
    }
    if (user?.role === "CUSTOMER" && location.pathname.includes("/driver")) {
      return <Navigate to="/customer/dashboard" replace />;
    }
    if (user?.role === "DRIVER" && location.pathname.includes("/admin")) {
      return <Navigate to="/driver/dashboard" replace />;
    }
    if (user?.role === "DRIVER" && location.pathname.includes("/customer")) {
      return <Navigate to="/driver/dashboard" replace />;
    }
    if (user?.role === "ADMIN" && (location.pathname.includes("/customer") || location.pathname.includes("/driver"))) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default CheckAuth;
