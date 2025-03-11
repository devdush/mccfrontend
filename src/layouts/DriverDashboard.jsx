import * as React from "react";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router-dom";
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import LogoutIcon from "@mui/icons-material/Logout";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import HistoryIcon from '@mui/icons-material/History';
import Person2Icon from '@mui/icons-material/Person2';
const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "driver/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "driver/view-orders",
    title: "View Orders",
    icon: <TimeToLeaveIcon />,
  },

  {
    segment: "driver/order-history",
    title: "Order History",
    icon: <HistoryIcon />,
  },
  {
    segment: "driver/profile",
    title: "Profile",
    icon: <Person2Icon />,
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
const DriverDashboardLayout = () => {
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
 
export default DriverDashboardLayout;