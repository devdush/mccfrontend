import React from "react";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { registerUser } from "../services/auth/register";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const DriverRegister = () => {
  const handleSubmit = async(values, { resetForm }) => {
    console.log("Form Submitted", values);
    const obj = {
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: "CUSTOMER",
    }
    try {
        const response = await registerUser(obj);
        if (response.status === 201) {
            toast.success("User registered successfully");
            window.location.href = "/auth/login";
        }
        else {
            toast.error("Failed to register user");
        }
    } catch (error) {
        toast.error("Failed to register user");
    }
    
    resetForm();
  };

  return (
    <Container maxWidth="sm" style={styles.container}>
      <Paper elevation={3} style={styles.paper}>
        <Typography variant="h4" style={styles.title}>Register as Driver</Typography>
        <Formik
          initialValues={{ username: "", email: "", password: "", phone: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form style={styles.form}>
              <Field
                as={TextField}
                label="Username"
                name="username"
                fullWidth
                margin="normal"
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
              />
              <Field
                as={TextField}
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
              <Field
                as={TextField}
                label="Phone"
                name="phone"
                fullWidth
                margin="normal"
       
                error={touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth style={styles.button}>
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

const styles = {
  container: {

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  paper: {
    backgroundColor: "#f9f9f9a9",
    padding: "30px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    fontSize: "16px",
  },
};

export default DriverRegister;
