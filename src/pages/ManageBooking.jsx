import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { getOrdersByCustomerId } from "../services/orderService/getOrdersByCustomer";
import { getCustomerByUserId } from "../services/customerService/getCustomerByUserId";
import { toast } from "react-toastify";
import { deleteOrder } from "../services/orderService/deleteOrder";
const ManageBooking = () => {
  const [token, setToken] = useState(
    sessionStorage.getItem("token")?.replace(/^"|"$/g, "")
  );
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem("user")).id;

        const customerResponse = await getCustomerByUserId(userId, token);
        const customer = customerResponse.data.id;

        const response = await getOrdersByCustomerId(customer, token);
        console.log(response.data);
        setFilteredData(response.data);
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
        console.log(response)
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
              console.log(params.row.id);
                handleDelete(params.row.id);
            }}
            style={{
              backgroundColor: "#af574c",
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

export default ManageBooking;
