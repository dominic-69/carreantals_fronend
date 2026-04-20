import React, { useEffect, useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { getMyAccessories, deleteAccessory } from "../../services/api";
import { useNavigate } from "react-router-dom";

const MyAccessories = () => {
  const [accessories, setAccessories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      const res = await getMyAccessories();
      setAccessories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this accessory?")) return;
    try {
      await deleteAccessory(id);
      fetchAccessories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <SellerSidebar />

      <div style={{ flex: 1, padding: "40px" }}>
        {/* Header Section */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "32px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "20px"
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>My Inventory</h2>
            <p style={{ margin: "4px 0 0 0", color: "#64748b" }}>Manage your listed car accessories</p>
          </div>
          <button 
            onClick={() => navigate("/seller/add-accessory")}
            style={{
              padding: "12px 24px",
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
            }}
          >
            + Add New Item
          </button>
        </div>

        {/* Grid Section */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: "28px" 
        }}>
          {accessories.map((item) => (
            <div key={item.id} style={{
              background: "#fff",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f1f5f9",
              transition: "transform 0.2s ease"
            }}>
              
              {/* IMAGE WRAPPER */}
              <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ height: "100%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                    No Image Available
                  </div>
                )}
                {/* Floating Status Badge */}
                <div style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  background: item.is_approved ? "#dcfce7" : "#fef9c3",
                  color: item.is_approved ? "#15803d" : "#a16207",
                  backdropFilter: "blur(4px)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  {item.is_approved ? "Approved" : "Pending"}
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: "700" }}>{item.name}</h3>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "#6366f1" }}>₹{item.price}</span>
                </div>
                
                <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "14px" }}>{item.brand}</p>

                <div style={{ 
                  display: "flex", 
                  gap: "10px", 
                  borderTop: "1px solid #f1f5f9", 
                  paddingTop: "16px" 
                }}>
                  <button
                    onClick={() => navigate(`/seller/edit-accessory/${item.id}`)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#f1f5f9",
                      color: "#475569",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#e2e8f0"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#f1f5f9"}
                  >
                    Edit Item
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: "10px 15px",
                      background: "#fff",
                      color: "#ef4444",
                      border: "1px solid #fee2e2",
                      borderRadius: "10px",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#ef4444";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.color = "#ef4444";
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {accessories.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: "50px", marginBottom: "20px" }}>📦</div>
            <h3>No accessories listed yet.</h3>
            <p>Start by adding your first product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccessories;