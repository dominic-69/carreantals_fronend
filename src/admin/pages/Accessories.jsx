/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "../components/AdminSidebar";

const AccessoriesAdmin = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      const res = await API.get("accessories/");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ 🔥 FIXED URL HERE
  const handleApprove = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await API.post(`accessories/admin/${id}/approve/`); // ✅ FIXED
      fetchAccessories();
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Approve failed ❌");
    }
  };

  // ✅ (this was already correct)
  const handleReject = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await API.delete(`accessories/${id}/delete/`);
      fetchAccessories();
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Reject failed ❌");
    }
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#f1f5f9", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <AdminSidebar />

      <div style={{ padding: "40px", flex: 1 }}>
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>Accessory Approval</h2>
            <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Review and manage pending accessory listings</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              style={{
                background: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={item.images?.[0]?.image}
                  alt="product"
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />

                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  backgroundColor: item.is_approved ? "#dcfce7" : "#fef9c3",
                  color: item.is_approved ? "#15803d" : "#854d0e",
                }}>
                  {item.is_approved ? "Approved" : "Pending"}
                </div>
              </div>

              <div style={{ padding: "20px" }}>
                <h3>{item.name}</h3>
                <p style={{ fontSize: "20px", fontWeight: "800", color: "#6366f1" }}>
                  ₹ {item.price}
                </p>

                {!item.is_approved && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button
                      onClick={(e) => handleApprove(item.id, e)}
                      style={{ flex: 1, padding: "10px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px" }}
                    >
                      Approve
                    </button>

                    <button
                      onClick={(e) => handleReject(item.id, e)}
                      style={{ flex: 1, padding: "10px", border: "1px solid #fee2e2", borderRadius: "8px", background: "#fff", color: "#ef4444" }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessoriesAdmin;