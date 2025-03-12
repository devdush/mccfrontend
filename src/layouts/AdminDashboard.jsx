import * as React from "react";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router-dom";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LogoutIcon from "@mui/icons-material/Logout";
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "admin/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "admin/orders",
    title: "View Orders",
    icon: <BookmarkBorderIcon />,
  },
  {
    segment: "admin/drivers",
    title: "View Drivers",
    icon: <DriveEtaIcon />,
  },
  {
    segment: "admin/customers",
    title: "View Customers",
    icon: <EmojiPeopleIcon />,
  },
  {
    segment: "admin/reports",
    title: "Reports",
    icon: <AssessmentIcon />,
  },
  {
    segment: "admin/profile",
    title: "Profile",
    icon: <PersonIcon />,
  },

  {
    segment: "admin/orders",
    title: "Logout",
    icon: <LogoutIcon />,
  },
];

const demoTheme = createTheme({
  palette: {
    background: {
      default: "#f5f5f5",
    },
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});
const AdminDashboardLayout = () => {
    const [pathname, setPathname] = React.useState("/dashboard");

    return (
      <AppProvider
        navigation={NAVIGATION}
        theme={demoTheme}
        branding={{
          logo: "",
          title: "MEGA CABS",
        }}
      >
        <DashboardLayout>
          {/* <Typography>Dashboard content for {pathname}</Typography> */}
          <Outlet />
        </DashboardLayout>
      </AppProvider>
      // preview-end
    );
}
 
export default AdminDashboardLayout;