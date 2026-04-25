import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/api";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📜 My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} style={card}>
            <h3>Order #{order.order_id}</h3>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.total}</p>

            <div>
              {order.items.map((item, index) => (
                <div key={index} style={itemCard}>
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                    style={{ width: "80px", height: "80px" }}
                  />
                  <div>
                    <p>{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;

const card = {
  background: "#fff",
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const itemCard = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
  alignItems: "center",
};