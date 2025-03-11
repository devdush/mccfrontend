import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { getCustomerByUserId } from "../services/customerService/getCustomerByUserId";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { addCustomer } from "../services/customerService/addCustomer";
import { toast } from "react-toastify";

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

const CustomerDashboard = () => {
  const savedUser = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token")?.replace(/^"|"$/g, "");
  const [isCustomer, setIsCustomer] = useState(false);
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .max(100, "Name must be 100 characters or less"),
    address: Yup.string().required("Address is required"),
    nic: Yup.string()
      .required("NIC is required")
      .length(12, "NIC must be exactly 12 characters"),
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getCustomerByUserId(savedUser.id, token);
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
    const obj = {
      user: {
        id: savedUser.id,
      },
      name: values.name,
      address: values.address,
      nic: values.nic,
    };
    const response = await addCustomer(obj, token);
    console.log(response);
    if (response.status === 201) {
      toast.success("Customer added successfully");
      setIsCustomer(true);
      document.getElementById("customer-form").style.display = "none";
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
              Customer Form
            </Typography>
            <Formik
              initialValues={{ name: "", address: "", nic: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form style={{ width: "100%" }}>
                  <div style={{ marginBottom: "15px" }}>
                    <Field name="name" as={TextField} fullWidth label="Name" />
                    <ErrorMessage
                      name="name"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <Field
                      name="address"
                      as={TextField}
                      fullWidth
                      label="Address"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <Field name="nic" as={TextField} fullWidth label="NIC" />
                    <ErrorMessage
                      name="nic"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>

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

export default CustomerDashboard;
