import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import { getCustomerByUserId } from "../services/customerService/getCustomerByUserId";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { addCustomer } from "../services/customerService/addCustomer";
import { toast } from "react-toastify";
import { getDriverByUserId } from "../services/driverService/getDriverByUserId";
import { addVehicle } from "../services/VehicleService/addVehicle";
import { addDriver } from "../services/driverService/addDriver";

const DashboardCard = ({ title, value }) => (
  <Card sx={{ minWidth: 250, textAlign: "center", p: 2, boxShadow: 3 }}>
    <CardContent>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const DriverDashboard = () => {
  const savedUser = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token")?.replace(/^"|"$/g, "");
  const [isCustomer, setIsCustomer] = useState(false);
  const validationSchema = Yup.object({
    licenseNumber: Yup.string().required("License Number is required"),
    plateNumber: Yup.string().required("Plate Number is required"),
    model: Yup.string().required("Vehicle Model is required"),
    vehicleType: Yup.string().required("Vehicle Type is required"),
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getDriverByUserId(savedUser.id, token);
        console.log(response);
        setIsCustomer(false);
      } catch (error) {
        console.log(error);
        setIsCustomer(true);
      }
    };
    getData();
  }, []);
  const handleSubmit = async (values, { resetForm }) => {
    console.log("Form Submitted", values);
    let capacity = 0;
    if (values.vehicleType === "tuks") {
      capacity = 3;
    } else if (values.vehicleType === "mini") {
      capacity = 4;
    } else if (values.vehicleType === "cars") {
      capacity = 4;
    } else if (values.vehicleType === "vans") {
      capacity = 8;
    }
    const vehicleObj = {
      type: values.vehicleType,
      plateNumber: values.plateNumber,
      model: values.model,
      capacity: capacity,
    };
    console.log(vehicleObj);
    try {
      const vehicleResponse = await addVehicle(
        values.vehicleType,
        vehicleObj,
        token
      );
      console.log(vehicleResponse);
      if (vehicleResponse.status === 201) {
        toast.success("Vehicle added successfully");
        const obj = {
          user: {
            id: savedUser.id,
          },
          vehicle: {
            type: values.vehicleType,
            id: vehicleResponse.data.id,
          },
          licenseNumber: values.licenseNumber,
          isAvailable: true,
          rating: 0,
        };
        console.log("sadsadad",obj)
        const response = await addDriver(obj, token);
        console.log(response);
        if (response.status === 200) {
          toast.success("Driver added successfully");
          setIsCustomer(true);
          document.getElementById("customer-form").style.display = "none";
        } else {
          toast.error("Failed to add driver");
        }
      }
    } catch (error) {
      console.log(error);
    }

    resetForm();
  };
  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Hi, {savedUser.username} Welcome To Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <DashboardCard title="Total Bookings" value={"120"} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DashboardCard title="Active Rides" value={"8"} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DashboardCard title="Total Earnings" value={"LKR 3,500"} />
          </Grid>
        </Grid>
        {isCustomer && (
          <Box
            id="customer-form"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              margin: "auto",
            }}
          >
            <Typography variant="h4" style={{ marginBottom: "20px" }}>
              Driver Form
            </Typography>
            <Formik
              initialValues={{
                licenseNumber: "",
                plateNumber: "",
                model: "",
                vehicleType: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form style={{ width: "100%" }}>
                  Driver Details
                  <div style={{ marginBottom: "15px" }}>
                    <Field
                      name="licenseNumber"
                      as={TextField}
                      fullWidth
                      label="licenseNumber"
                    />
                    <ErrorMessage
                      name="licenseNumber"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                  Vehicle Details
                  <div style={{ marginBottom: "15px" }}>
                    <Field
                      name="plateNumber"
                      as={TextField}
                      fullWidth
                      label="Plate Number"
                    />
                    <ErrorMessage
                      name="plateNumber"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <Field
                      name="model"
                      as={TextField}
                      fullWidth
                      label="Vehicle Model"
                    />
                    <ErrorMessage
                      name="model"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    name="vehicleType"
                    label="Select Vehicle Type"
                    variant="outlined"
                    margin="dense"
                  >
                    <MenuItem value="tuks">TUK (3 Passengers)</MenuItem>
                    <MenuItem value="mini">MINI (4 Passengers)</MenuItem>
                    <MenuItem value="cars">CAR (4 Passengers)</MenuItem>
                    <MenuItem value="vans">VAN (8 Passengers)</MenuItem>
                  </Field>
                  <ErrorMessage
                    name="vehicleType"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DriverDashboard;
