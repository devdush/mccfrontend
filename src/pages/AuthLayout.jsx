import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import image from "./register.jpg";
const AuthLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
