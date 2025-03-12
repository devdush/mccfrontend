import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { getOrdersByCustomerId } from "../services/orderService/getOrdersByCustomer";
import { getCustomerByUserId } from "../services/customerService/getCustomerByUserId";
import { toast } from "react-toastify";
import { deleteOrder } from "../services/orderService/deleteOrder";
import { getOrders } from "../services/orderService/getOrders";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { getDrivers } from "../services/driverService/getDrivers";
import { addBooking } from "../services/bookingSerive/addBooking";
import { updateOrder } from "../services/orderService/updateOrder";
const ViewOrders = () => {
  const [token, setToken] = useState(
    sessionStorage.getItem("token")?.replace(/^"|"$/g, "")
  );
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [open, setOpen] = useState(false);
  const [drivers, setDrivers] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getOrders(token);
        const driverResponse = await getDrivers(token);
        setFilteredData(response.data);
        setDrivers(driverResponse.data);
        console.log(driverResponse);
      } catch (error) {
        toast.error("Something went wrong while fetching initial data");
      }
    };
    getData();
  }, []);
  const handleDelete = async (id) => {
    console.log(id);
    try {
      const response = await deleteOrder(id, token);
      console.log(response);
      if (response.status === 204) {
        toast.success("Order deleted successfully");
        const updatedData = filteredData.filter((data) => data.id !== id);
        setFilteredData(updatedData);
      } else {
        toast.error("Failed to delete the order");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the order");
    }
  };
  const handleUpdate = (id) => {
    console.log(id);
    setSelectedItem(id);
    handleOpen();
  };
  const validationSchema = Yup.object().shape({
    status: Yup.string()
      .oneOf(["PENDING", "ACCEPTED", "CANCELLED"], "Invalid status") // Ensure only valid values
      .required("Status is required"), // Ensure it's not empty
  });
  const columns = [
    {
      field: "orderDate",
      headerName: "Date",
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toDateString();
      },
    },
    {
      field: "distance",
      headerName: "Distance (KM)",
      flex: 1,
      valueFormatter: (params) => {
        // Format the value to 2 decimal points
        const value = Number(params);

        return value.toFixed(2);
      },
    },
    {
      field: "fare",
      headerName: "Fare (LKR)",
      flex: 1,
      valueFormatter: (params) => {
        // Format the value to 2 decimal points
        const value = Number(params);

        return value.toFixed(2);
      },
    },
    {
      field: "vehicleType",
      headerName: "Vehicle",
      flex: 2,
      renderCell: (params) => (
        <Box style={{ textTransform: "uppercase" }}>{params.value}</Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      renderCell: (params) => (
        <Box style={{ textTransform: "uppercase" }}>{params.value}</Box>
      ),
    },
    {
      field: "id",
      headerName: "Action",
      flex: 2,
      renderCell: (params) => (
        <Box>
          <button
            onClick={() => {
              // Handle delete button click
              console.log(params.row);
              handleUpdate(params.row);
            }}
            style={{
              backgroundColor: "#f5a906",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Update
          </button>
          <button
            onClick={() => {
              // Handle delete button click
              console.log(params.row.id);
              handleDelete(params.row.id);
            }}
            style={{
              backgroundColor: "#c71903",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </Box>
      ),
    },
  ];
  return (
    <Box>
        <h1 style={{textAlign:"center"}}>Orders Details</h1>
      <Box
        display="grid"
        height="78vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: "15px",
          },
          "& .name-column--cell": {
            color: "#000000",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#ffffff",
            border: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#d6d6d6",
          },
          "& .MuiCheckbox-root": {
            color: `"#b7ebde" !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `"#f8dcdb" !important`,
          },
        }}
      >
        <DataGrid
          rows={filteredData} // Use filtered data here
          getRowId={(row) => row.id}
          columns={columns}
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", justifyContent: "center", padding: "10px" }}
      >
        <Box
          sx={{
            width: "60%",
            padding: "10px",

            bgcolor: "white",
            color: "black",
            backdropFilter: "blur(3px)", // Blur effect

            // boxShadow: "0 8px 32px rgba(167, 167, 167, 0.37)", // Softer shadow for depth
            border: "1px solid rgba(255, 255, 255, 0.18)", // Light border
            textAlign: "center",
            "@media (max-width: 600px)": {
              width: "90%", // Smaller screen adjustment
              maxWidth: "100%",
              p: 3,
            },
            display: "flex",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {selectedItem ? (
            <Formik
              initialValues={{
                status: "PENDING",
                orderDate: selectedItem.orderDate,
                distance: selectedItem.distance,
                fare: selectedItem.fare,
                vehicleType: selectedItem.vehicleType,
                customerName: selectedItem.customer.name,
                driver: {},
                orderId: selectedItem.id,
                customerId: selectedItem.customer.id,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                console.log(values);
                const obj = {
                  customer: {
                    id: values.customerId,
                  },
                  order: {
                    id: values.orderId,
                  },
                  driver: {
                    id: values.driver,
                  },
                  status: values.status,
                  bookingTime: new Date().toISOString(),
                };

                const orderObj = {
                  customer: { id: values.customerId },

                  pickupLocation: selectedItem.pickupLocation,
                  dropoffLocation: selectedItem.dropoffLocation,
                  vehicleType: selectedItem.vehicleType,
                  distance: selectedItem.distance,
                  fare: selectedItem.fare,
                  status: values.status,
                  orderDate: selectedItem.orderDate,
                };

                try {
                  const response = await addBooking(obj, token);
                  if (response.status === 200) {
                    toast.success("Booking added successfully");
                    handleClose();
                  }

                  const orderResponse = await updateOrder(
                    orderObj,
                    token,
                    values.orderId
                  );
                  if (orderResponse.status === 200) {
                    toast.success("Order updated successfully");
                    handleClose();
                  }
                } catch (error) {
                  console.log(error);
                  toast.error("Failed to update the order");
                }
                setSubmitting(false);
              }}
            >
              {({
                errors,
                values,
                handleChange,
                handleBlur,
                touched,
                isSubmitting,
                setFieldValue,
                resetForm,
              }) => (
                <Form>
                  <Typography variant={"h2"}>Customer Order</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        flex: 4,
                        display: "flex",
                        padding: "10px",
                        flexDirection: "column",
                        gap: "20px",
                        width: "500px",
                      }}
                    >
                      <Field
                        as={TextField}
                        label="Order Date"
                        name="orderDate"
                        type="status"
                        fullWidth
                        margin="normal"
                        error={touched.status && !!errors.status}
                        helperText={touched.status && errors.status}
                        disabled
                      />
                      <Field
                        as={TextField}
                        label="Customer Name"
                        name="customerName"
                        type="status"
                        fullWidth
                        margin="normal"
                        error={touched.status && !!errors.status}
                        helperText={touched.status && errors.status}
                        disabled
                      />
                      <Field
                        as={TextField}
                        label="Vehicle"
                        name="vehicleType"
                        type="status"
                        fullWidth
                        margin="normal"
                        error={touched.status && !!errors.status}
                        helperText={touched.status && errors.status}
                        disabled
                      />
                    </Box>
                    <Box
                      sx={{
                        flex: 4,
                        display: "flex",
                        padding: "10px",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <Field
                        as={TextField}
                        label="Distance (KM)"
                        name="distance"
                        type="status"
                        fullWidth
                        margin="normal"
                        error={touched.status && !!errors.status}
                        helperText={touched.status && errors.status}
                        disabled
                      />
                      <Field
                        as={TextField}
                        label="Fare (LKR)"
                        name="fare"
                        type="status"
                        fullWidth
                        margin="normal"
                        error={touched.status && !!errors.status}
                        helperText={touched.status && errors.status}
                        disabled
                      />
                      <Field
                        as={TextField}
                        select
                        fullWidth
                        name="status"
                        label="Status"
                        variant="outlined"
                        margin="dense"
                        value={values.status} // Ensure value is controlled by Formik
                        onChange={handleChange}
                      >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="ACCEPTED">Accept</MenuItem>
                        <MenuItem value="CANCELLED">Cancel</MenuItem>
                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        style={{ color: "red", fontSize: "12px" }}
                      />
                      {drivers && (
                        <>
                          <Field
                            as={TextField}
                            select
                            fullWidth
                            name="driver"
                            label="Driver"
                            variant="outlined"
                            margin="dense"
                          >
                            {drivers.map((driver) => (
                              <MenuItem key={driver.id} value={driver.id}>
                                {`${driver.user.username} (${driver.vehicle.type})`}
                              </MenuItem>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="driver"
                            component="div"
                            style={{ color: "red", fontSize: "12px" }}
                          />
                        </>
                      )}
                    </Box>
                  </Box>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    sx={{ backgroundColor: "#20C4C4" }}
                  >
                    Save
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <p>Loading...</p>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewOrders;
