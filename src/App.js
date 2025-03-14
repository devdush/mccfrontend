import logo from "./logo.svg";
import "./App.css";
import { LoginUser } from "./store/action/auth";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CheckAuth from "./common/check-auth";
import AdminDashboardLayout from "./layouts/AdminDashboard";
import CustomerDashboardLayout from "./layouts/CustomerDashboard";
import CustomerDashboard from "./pages/CustomerDB";
import DriverDashboard from "./pages/DriverDB";
import DriverDashboardLayout from "./layouts/DriverDashboard";
import AuthLayout from "./pages/AuthLayout";
import CreateBooking from "./pages/CreateBooking";
import ManageBooking from "./pages/ManageBooking";
import BookingHistory from "./pages/BookingHistory";
import Profile from "./pages/Profile";
import DriverRegister from "./pages/DriverRegister";
import AdminDashboard from "./pages/AdminDB";
import ViewOrders from "./pages/ViewOrders";
import ViewDrivers from "./pages/ViewDrivers";
import ViewCustomers from "./pages/ViewCustomers";
import ViewReports from "./pages/viewReports";
import AcceptOrders from "./pages/AcceptOrders";

function App() {
  const dispatch = useDispatch();
  // const onButtonClick = () => {
  //   console.log("Button clicked");
  //   const obj = {
  //     email: "haritha2@gmail.com",
  //     password: "12345",
  //   };
  //   dispatch(LoginUser(obj));
  // };
  // const { user, isAuthenticated, isLoading } = useSelector(
  //   (state) => state.auth
  // );
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAuthenticated = sessionStorage.getItem("token") ? true : false
  return (
    <div >
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="register-driver" element={<DriverRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminDashboardLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<ViewOrders />} />
          <Route path="drivers" element={<ViewDrivers />} />
          <Route path="customers" element={<ViewCustomers />} />
          <Route path="reports" element={<ViewReports />} />
        </Route>
        <Route
          path="/customer/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <CustomerDashboardLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="create-booking" element={<CreateBooking />} />
          <Route path="all-bookings" element={<ManageBooking />} />
          <Route path="bookings-history" element={<BookingHistory />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Driver Routes */}
        <Route
          path="/driver/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <DriverDashboardLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="view-orders" element={<AcceptOrders />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
