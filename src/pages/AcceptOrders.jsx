import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { getOrdersByCustomerId } from "../services/orderService/getOrdersByCustomer";
import { getCustomerByUserId } from "../services/customerService/getCustomerByUserId";
import { toast } from "react-toastify";
import { deleteOrder } from "../services/orderService/deleteOrder";
import { getDriverByUserId } from "../services/driverService/getDriverByUserId";
import { getBookingsByDriverId } from "../services/bookingSerive/getBookingByDriverId";
import updateBooking, {
  updateBookings,
} from "../services/bookingSerive/updateBooking";
import { updateDriver } from "../services/driverService/updateDriver";
const AcceptOrders = () => {
  const [token, setToken] = useState(
    sessionStorage.getItem("token")?.replace(/^"|"$/g, "")
  );
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem("user")).id;
        console.log("UID", userId);

        const driverResponse = await getDriverByUserId(userId, token);
        console.log("DR", driverResponse);
        const driverId = driverResponse.data.id;
        const response = await getBookingsByDriverId(driverId, token);
        console.log("Res", response);

        setFilteredData(response.data);
      } catch (error) {
        toast.error("Something went wrong while fetching initial data");
      }
    };
    getData();
  }, []);
  const handleStart = async (id) => {
    const driverObj = {
      user: {
        id: id.driver.user.id,
      },
      vehicle: {
        id: id.driver.vehicle.id,
        type: id.driver.vehicle.type,
      },
      licenseNumber: id.driver.licenseNumber,
      isAvailable: false,
      rating: id.driver.rating,
      id: id.driver.id,
    };

    try {
      if (id.status === "ACCEPTED") {
        const bookingResponse = await updateBookings(id.id, "ON_TRIP", token);
        console.log("bookingResponse", bookingResponse);
        if (bookingResponse.status === 200) {
          toast.success("Driver started the order successfully");
          const response = await updateDriver(driverObj, token);
          console.log("response", response);
          if (response.status === 200) {
            toast.success("Driver started the order successfully");
          } else {
            toast.error("Failed to start the order");
          }
        } else {
          toast.error("Failed to start the order");
        }
      } else {
        const bookingResponse = await updateBookings(id.id, "COMPLETED", token);
        console.log("bookingResponse", bookingResponse);
        if (bookingResponse.status === 200) {
          const driverObj2 = {
            user: {
              id: id.driver.user.id,
            },
            vehicle: {
              id: id.driver.vehicle.id,
              type: id.driver.vehicle.type,
            },
            licenseNumber: id.driver.licenseNumber,
            isAvailable: true,
            rating: id.driver.rating,
            id: id.driver.id,
          };
          toast.success("Driver ended the order successfully");
          const response = await updateDriver(driverObj2, token);
          console.log("response", response);
          if (response.status === 200) {
            toast.success("Driver ended the order successfully");
          } else {
            toast.error("Failed to end the order");
          }
        } else {
          toast.error("Failed to end the order");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to start the order");
    }
  };

  const columns = [
    {
      field: "orderDate",
      headerName: "Date",
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        const date = new Date(params.row.bookingTime);
        return date.toDateString();
      },
    },
    {
      field: "customer.name",
      headerName: "Customer Name",
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return params.row.customer.name;
      },
    },
    {
      field: "user.phone",
      headerName: "Customer Phone",
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return params.row.customer.user.phone;
      },
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
              console.log(params?.row?.id);
              handleStart(params?.row);
            }}
            style={{
              backgroundColor:
                params?.row?.status === "ACCEPTED" ? "green" : "red",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={params?.row?.status === "COMPLETED"}
          >
            {params?.row?.status === "ACCEPTED"
              ? "START"
              : params?.row?.status === "ON_TRIP"
                ? "END"
                : "COMPLETED"}{" "}
          </button>
        </Box>
      ),
    },
  ];
  return (
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
  );
};

export default AcceptOrders;
