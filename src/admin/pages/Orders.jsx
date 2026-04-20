import React from "react";
import AdminSidebar from "../components/AdminSidebar";

const Orders = () => {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={{ padding: "30px" }}>
        <h2>Orders</h2>
        <p>All orders will be displayed here 🚀</p>
      </div>
    </div>
  );
};

export default Orders;