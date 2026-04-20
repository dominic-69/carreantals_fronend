import React, { useEffect, useState } from "react";
import { getCart, removeCart } from "../../services/api";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeCart(id);
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>🛒 My Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} style={card}>
              
              {/* 🔥 IMAGE */}
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
              />

              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Qty: {item.quantity}</p>
              <p>Subtotal: ₹{item.subtotal}</p>

              <button onClick={() => handleRemove(item.id)} style={removeBtn}>
                Remove ❌
              </button>
            </div>
          ))}

          <h2>Total: ₹{total}</h2>
        </>
      )}
    </div>
  );
}

export default Cart;

const card = {
  background: "#fff",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const removeBtn = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer",
};