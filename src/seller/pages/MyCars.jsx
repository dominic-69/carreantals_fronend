import React, { useEffect, useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { getMyCars, deleteCar } from "../../services/api";
import { useNavigate } from "react-router-dom";

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await getMyCars();
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this car?");
    if (!confirmDelete) return;

    try {
      await deleteCar(id);
      alert("Deleted successfully 🗑️");
      fetchCars();
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  // ✅ EDIT
  const handleEdit = (id) => {
    navigate(`/seller/edit-car/${id}`);
  };

  // --- Styles ---
  const pageContainer = {
    display: "flex",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  };

  const contentArea = {
    padding: "40px",
    width: "100%",
    position: "relative",
  };

  const carGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
    marginTop: "30px",
  };

  const cardStyle = (index) => ({
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`,
    opacity: 0,
    display: "flex",
    flexDirection: "column",
  });

  const floatingCarWrapper = {
    fontSize: "50px",
    textAlign: "center",
    animation: "float 3s ease-in-out infinite",
    marginBottom: "10px",
    display: "inline-block",
  };

  return (
    <div style={pageContainer}>
      <SellerSidebar />

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .car-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 30px rgba(0,0,0,0.1);
            border-color: #3b82f6;
          }
          .image-glow:hover {
            filter: brightness(1.1);
          }
        `}
      </style>

      <div style={contentArea}>
        <div style={{ textAlign: "left", marginBottom: "40px" }}>
          <div style={floatingCarWrapper}>🚗</div>
          <h2 style={{ margin: 0, fontSize: "32px", color: "#1e293b" }}>Inventory</h2>
          <p style={{ color: "#64748b" }}>Manage and track your listed vehicles</p>
        </div>

        {cars.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px", color: "#94a3b8" }}>
            <p style={{ fontSize: "18px" }}>No cars added yet 🚫</p>
          </div>
        ) : (
          <div style={carGrid}>
            {cars.map((car, index) => (
              <div key={car.id} className="car-card" style={cardStyle(index)}>
                
                {/* IMAGE */}
                <div style={{ height: "200px", background: "#edf2f7", overflow: "hidden", display: "flex" }}>
                  {car.images && car.images.length > 0 ? (
                    <img 
                      src={car.images[0].image} 
                      alt="car" 
                      className="image-glow"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div style={{ margin: "auto", color: "#cbd5e1" }}>No Image Available</div>
                  )}
                </div>

                {/* CONTENT */}
                <div style={{ padding: "20px" }}>
                  <h3>{car.title}</h3>
                  <p>₹ {car.price}</p>
                  <p>📍 {car.location}</p>
                  <p>{car.description}</p>
                </div>

                {/* 🔥 BUTTONS ADDED */}
                <div style={{
                  padding: "15px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #eee"
                }}>
                  <button onClick={() => handleEdit(car.id)} style={editBtn}>
                    ✏️ Edit
                  </button>

                  <button onClick={() => handleDelete(car.id)} style={deleteBtn}>
                    🗑️ Delete
                  </button>

                  {/* <button onClick={() => navigate(`/car/${car.id}`)} style={viewBtn}>
                    View →
                  </button> */}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCars;

// 🔥 BUTTON STYLES
const editBtn = {
  background: "#facc15",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer"
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer"
};

// const viewBtn = {
//   background: "none",
//   border: "none",
//   color: "#2563eb",
//   fontWeight: "bold",
//   cursor: "pointer"
// };