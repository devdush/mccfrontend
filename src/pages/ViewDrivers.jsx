import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { getOrdersByCustomerId } from "../services/orderService/getOrdersByCustomer";
import { getCustomerByUserId } from "../services/customerService/getCustomerByUserId";
import { toast } from "react-toastify";
import { deleteOrder } from "../services/orderService/deleteOrder";
import { getDrivers } from "../services/driverService/getDrivers";
import { deleteDriver } from "../services/driverService/deleteDriver";
const ViewDrivers = () => {
  const [token, setToken] = useState(
    sessionStorage.getItem("token")?.replace(/^"|"$/g, "")
  );
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getDrivers(token);

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
      //   const response = await deleteDriver(id, token);
      //   console.log(response);
      //   if (response.status === 204) {
      toast.success("Order deleted successfully");
      const updatedData = filteredData.filter((data) => data.id !== id);
      setFilteredData(updatedData);
      //   } else {
      //     toast.error("Failed to delete the order");
      //   }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the order");
    }
  };

  const columns = [
    {
      field: "user.username", // Correct path to the username field
      headerName: "Name",
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return params.row.user?.username || "N/A"; // Ensure it doesn't break if user is undefined
      },
    },

    {
      field: "licenseNumber",
      headerName: "License Number",
      flex: 1,
      valueFormatter: (params) => {
        // Format the value to 2 decimal points
        const value = Number(params);

        return value;
      },
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 1,
      valueFormatter: (params) => {
        // Format the value to 2 decimal points
        const value = Number(params);

        return value.toFixed(2);
      },
    },
    {
      field: "vehicle.type",
      headerName: "Vehicle",
      flex: 2,
      renderCell: (params) => (
        <Box style={{ textTransform: "uppercase" }}>
          {params.row.vehicle.type}
        </Box>
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
    <Box>
      <h1 style={{ textAlign: "center" }}>Driver Details</h1>

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
    </Box>
  );
};

export default ViewDrivers;
