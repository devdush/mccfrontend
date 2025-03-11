import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

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
      </Box>
    </Box>
  );
};

export default CustomerDashboard;
