import React, { useEffect, useState } from "react";
import { getWishlist, removeWishlist, addToCart } from "../../services/api";

function Wishlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setItems(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeWishlist(id);
      fetchWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMoveToCart = async (id) => {
    try {
      await addToCart(id);
      await removeWishlist(id);
      fetchWishlist();
      alert("Moved to cart 🛒");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "40px", background: "#f5f7fb", minHeight: "100vh" }}>
      <h1>❤️ My Wishlist</h1>

      {items.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <div key={item.id} style={styles.card}>

              {/* 🔥 IMAGE */}
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
              />

              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <div style={styles.btnGroup}>
                <button
                  style={styles.cartBtn}
                  onClick={() => handleMoveToCart(item.id)}
                >
                  Move to Cart 🛒
                </button>

                <button
                  style={styles.removeBtn}
                  onClick={() => handleRemove(item.id)}
                >
                  Remove ❌
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  btnGroup: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  cartBtn: {
    flex: 1,
    padding: "10px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  removeBtn: {
    flex: 1,
    padding: "10px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};