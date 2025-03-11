import React from "react";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { registerUser } from "../services/auth/register";
import { toast } from "react-toastify";
import { loginUser } from "../services/auth/login";
import { useDispatch } from "react-redux";
import { LoginUser } from "../store/action/auth";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(5, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const handleSubmit = async (values, { resetForm }) => {
    console.log("Form Submitted", values);
    const obj = {
      email: values.email,
      password: values.password,
    };
    try {
     
      dispatch(LoginUser(obj));
      resetForm();
    } catch (error) {
      toast.error("Failed to register user");
    }

    resetForm();
  };

  return (
    <Container maxWidth="sm" style={styles.container}>
      <Paper elevation={3} style={styles.paper}>
        <Typography variant="h4" style={styles.title}>
          Login{" "}
        </Typography>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form style={styles.form}>
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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={styles.button}
              >
                Login{" "}
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

export default Login;
