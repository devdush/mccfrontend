import * as React from "react";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router-dom";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import CreateIcon from "@mui/icons-material/Create";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import DevicesIcon from "@mui/icons-material/Devices";
import CategoryIcon from "@mui/icons-material/Category";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LogoutIcon from "@mui/icons-material/Logout";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { Typography } from "@mui/material";
import ShieldIcon from '@mui/icons-material/Shield';
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
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "admin/drivers",
    title: "View Drivers",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "admin/customers",
    title: "View Customers",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "admin/reports",
    title: "Reports",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "admin/profile",
    title: "Profile",
    icon: <ShoppingCartIcon />,
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
          title: "VYS INTERNATIONALS",
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