import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Autocomplete from "react-google-autocomplete";
import { toast } from "react-toastify";
import { getCustomerByUserId } from "../services/customerService/getCustomerByUserId";
import { addOrder } from "../services/orderService/addOrder";

const GOOGLE_MAPS_API_KEY = "AIzaSyDl8K44hdP1sLOmVGQrllMt6ICJqhWx0MA"; // Replace with your API Key

const getDistance = async (pickup, dropoff) => {
  const API_KEY = "AIzaSyBZPgo2Ig4vxrqeRMHkN3PgS6jVxOun-iw"; // Replace with your API key

  const url =
    "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix";

  const requestBody = {
    origins: [
      {
        waypoint: {
          location: {
            latLng: { latitude: pickup.lat, longitude: pickup.lng },
          },
        },
      },
    ],
    destinations: [
      {
        waypoint: {
          location: {
            latLng: { latitude: dropoff.lat, longitude: dropoff.lng },
          },
        },
      },
    ],
    travelMode: "DRIVE", // Options: DRIVE, BICYCLE, WALK, TRANSIT
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "originIndex,destinationIndex,duration,distanceMeters",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log(data);
    if (data && data.length > 0) {
      const distanceMeters = data[0].distanceMeters;
      const distanceKm = (distanceMeters / 1000).toFixed(2); // Convert to KM
      console.log(`Distance: ${distanceKm} km`);
      return distanceKm;
    } else {
      console.error("No distance data found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching distance:", error);
    return null;
  }
};

const CreateBooking = () => {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [token, setToken] = useState(
    sessionStorage.getItem("token")?.replace(/^"|"$/g, "")
  );
  const [customer, setCustomer] = useState(null);
  const [fare, setFare] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem("user")).id;

        const response = await getCustomerByUserId(userId, token);

        if (response.status === 200) {
          const customer = response.data;

          setCustomer(customer);
        }
      } catch (error) {
        toast.error("Something went wrong while fetching initial data");
      }
    };
    getData();
  }, []);

  const initialValues = {
    pickupLocation: "",
    dropoffLocation: "",
    vehicleType: "",
  };

  const validationSchema = Yup.object({
    pickupLocation: Yup.string().required("Pickup location is required"),
    dropoffLocation: Yup.string().required("Dropoff location is required"),
    vehicleType: Yup.string().required("Vehicle type is required"),
  });
  const toRad = (value) => (value * Math.PI) / 180;

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    console.log(lat1, lon1, lat2, lon2);
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Order Submitted: ", values);
    // Convert pickup and dropoff locations from strings to numbers
    const [pickupLat, pickupLon] = values.pickupLocation
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    const [dropoffLat, dropoffLon] = values.dropoffLocation
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    const distance = haversineDistance(
      pickupLat,
      pickupLon,
      dropoffLat,
      dropoffLon
    );
    const TukFare = 50;
    const MiniFare = 150;
    const CarFare = 300;
    const VanFare = 1500;
    let fare = 0;
    if (values.vehicleType === "tuks") {
      fare = TukFare + distance * 10;
      console.log("Tuk Fare: ", fare);
    } else if (values.vehicleType === "mini") {
      fare = MiniFare + distance * 25;
      console.log("Mini Fare: ", fare);
    } else if (values.vehicleType === "cars") {
      fare = CarFare + distance * 35;
      console.log("Car Fare: ", fare);
    } else if (values.vehicleType === "vans") {
      fare = VanFare + distance * 80;
      console.log("Van Fare: ", fare);
    }
    setFare(fare);
    setDistance(distance);
    const obj = {
      customer: { id: customer.id },

      pickupLocation: values.pickupLocation,
      dropoffLocation: values.dropoffLocation,
      vehicleType: values.vehicleType,
      distance: distance,
      fare: fare,
      status: "PENDING",
      orderDate: new Date().toISOString(),
    };

    try {
      const response = await addOrder(obj, token);
      if (response.status === 200) {
        toast.success("Booking successful");
      } else {
        toast.error("Failed to add booking");
      }
      
    } catch (error) {
      toast.error("Failed to add booking");
    }
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
              border: "1px solid #ccc",
              borderRadius: "10px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <h2 style={{ textAlign: "center", color: "#1976d2" }}>
              Create Order
            </h2>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "10px",
                textAlign: "center",
              }}
            >
              {/* Pickup Location (Google Maps) */}
              <Box sx={{ margin: "10px", width: "50%" }}>
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
                    onClick={(e) =>
                      handleMapClick(e, setFieldValue, "pickupLocation")
                    }
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
              </Box>
              <Box sx={{ margin: "10px", width: "50%" }}>
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
                    onClick={(e) =>
                      handleMapClick(e, setFieldValue, "dropoffLocation")
                    }
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
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                margin: "10px",
              }}
            >
              <Box sx={{ margin: "10px", width: "50%" }}>
                Vehicle Type
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
              </Box>
              <Box sx={{ margin: "10px", width: "50%" }}>
                <Typography variant="h6" style={{ marginTop: "10px" }}>
                  Estimated Fare: LKR {(fare || 0).toFixed(2)}
                </Typography>
                <Typography variant="h6" style={{ marginTop: "10px" }}>
                  Estimated Distance: {(distance || 0).toFixed(2)} KM
                </Typography>
              </Box>
            </Box>
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
};

export default CreateBooking;
