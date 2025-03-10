import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, CircularProgress, Box, Typography } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Autocomplete from "react-google-autocomplete";

const GOOGLE_MAPS_API_KEY = "AIzaSyDl8K44hdP1sLOmVGQrllMt6ICJqhWx0MA"; // Replace with your API Key

const getDistance = async (pickup, dropoff) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickup}&destinations=${dropoff}&key=${GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  if (data.rows[0].elements[0].status === "OK") {
    return data.rows[0].elements[0].distance.text; // Distance in km/miles
  } else {
    return "Distance not available";
  }
};

const CreateBooking = () => {
    const [pickup, setPickup] = useState(null);
    const [dropoff, setDropoff] = useState(null);
  
    const initialValues = {
      customerId: "",
      pickupLocation: "",
      dropoffLocation: "",
      status: "Pending",
    };
  
    const validationSchema = Yup.object({
      customerId: Yup.string().required("Customer ID is required"),
      pickupLocation: Yup.string().required("Pickup location is required"),
      dropoffLocation: Yup.string().required("Dropoff location is required"),
      status: Yup.string().required("Status is required"),
    });
  
    const handleSubmit = (values, { setSubmitting, resetForm }) => {
      console.log("Order Submitted: ", values);
      setSubmitting(false);
      resetForm();
    };
  
    const handleMapClick = (event, setFieldValue, field) => {
      const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      if (field === "pickupLocation") {
        setPickup(latLng);
        setFieldValue("pickupLocation", `${latLng.lat}, ${latLng.lng}`);
      } else {
        setDropoff(latLng);
        setFieldValue("dropoffLocation", `${latLng.lat}, ${latLng.lng}`);
      }
    };
  
    return (
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form
              style={{
                maxWidth: "500px",
                margin: "auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <h2 style={{ textAlign: "center", color: "#1976d2" }}>
                Create Order
              </h2>
  
              {/* Customer ID */}
              <Field
                as={TextField}
                fullWidth
                name="customerId"
                label="Customer ID"
                variant="outlined"
                margin="dense"
              />
              <ErrorMessage
                name="customerId"
                component="div"
                style={{ color: "red", fontSize: "12px" }}
              />
  
              {/* Pickup Location (Google Maps) */}
              <label style={{ fontWeight: "bold", marginTop: "10px" }}>
                Pickup Location (Click on map)
              </label>
              <div
                style={{
                  height: "300px",
                  width: "100%",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                }}
              >
                <GoogleMap
                  mapContainerStyle={{ height: "100%", width: "100%" }}
                  zoom={12}
                  center={pickup || { lat: 6.9271, lng: 79.8612 }} // Default: Colombo, Sri Lanka
                  onClick={(e) => handleMapClick(e, setFieldValue, "pickupLocation")}
                >
                  {pickup && <Marker position={pickup} />}
                </GoogleMap>
              </div>
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                value={values.pickupLocation}
                disabled
              />
  
              {/* Dropoff Location (Google Maps) */}
              <label style={{ fontWeight: "bold", marginTop: "10px" }}>
                Dropoff Location (Click on map)
              </label>
              <div
                style={{
                  height: "300px",
                  width: "100%",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                }}
              >
                <GoogleMap
                  mapContainerStyle={{ height: "100%", width: "100%" }}
                  zoom={12}
                  center={dropoff || { lat: 6.9271, lng: 79.8612 }} // Default: Colombo, Sri Lanka
                  onClick={(e) => handleMapClick(e, setFieldValue, "dropoffLocation")}
                >
                  {dropoff && <Marker position={dropoff} />}
                </GoogleMap>
              </div>
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                value={values.dropoffLocation}
                disabled
              />
  
              {/* Status */}
              <Field
                as={TextField}
                select
                fullWidth
                name="status"
                label="Order Status"
                variant="outlined"
                margin="dense"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                style={{ color: "red", fontSize: "12px" }}
              />
  
              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "15px" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Submit Order"}
              </Button>
            </Form>
          )}
        </Formik>
      </LoadScript>
    );
  
}
 
export default CreateBooking;