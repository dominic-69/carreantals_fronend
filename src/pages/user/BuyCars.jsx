import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function BuyCars() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filters, setFilters] = useState({
    max_price: "",
    fuel_type: "",
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await API.get("cars/market/");
      setCars(res.data);
      setFilteredCars(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilter = () => {
    let temp = [...cars];
    if (filters.max_price) temp = temp.filter((car) => car.price <= filters.max_price);
    if (filters.fuel_type) temp = temp.filter((car) => car.fuel_type === filters.fuel_type);
    setFilteredCars(temp);
  };

  return (
    <div style={pageWrapper}>
      {/* 📱 RESPONSIVE & INTERACTIVE STYLES */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
          
          .car-card { transition: all 0.3s ease; }
          .car-card:hover { transform: translateY(-8px); border-color: #6366f1 !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
          
          /* Responsive adjustments */
          @media (max-width: 900px) {
            .main-layout { flex-direction: column !important; }
            .filter-sidebar { width: 100% !important; position: relative !important; top: 0 !important; margin-bottom: 20px; }
            .main-title { font-size: 32px !important; }
          }

          @media (max-width: 600px) {
            .grid-container { grid-template-columns: 1fr !important; }
            .header-section { text-align: center; }
          }
        `}
      </style>

      {/* HEADER */}
      <div className="header-section" style={headerSection}>
        <div>
          <button onClick={() => navigate("/")} style={backBtn}>← Back to Home</button>
          <h1 className="main-title" style={mainTitle}>Car <span style={{ color: "#6366f1" }}>Marketplace</span></h1>
          <p style={subtitle}>Find quality vehicles at the best prices.</p>
        </div>
      </div>

      <div className="main-layout" style={mainLayout}>
        {/* 🔍 FILTER SIDEBAR */}
        <div className="filter-sidebar" style={filterSidebar}>
          <h3 style={filterHeading}>Search Filters</h3>
          
          <div style={inputGroup}>
            <label style={labelStyle}>Max Budget (₹)</label>
            <input
              type="number"
              name="max_price"
              placeholder="Enter amount"
              value={filters.max_price}
              onChange={handleFilterChange}
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Fuel Type</label>
            <select name="fuel_type" value={filters.fuel_type} onChange={handleFilterChange} style={inputStyle}>
              <option value="">All Types</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <button onClick={applyFilter} style={filterBtn}>Apply Filters</button>
        </div>

        {/* 🚗 CAR GRID */}
        <div style={gridContainer}>
          {filteredCars.length === 0 ? (
            <div style={noCarsBox}>
              <p>No cars match your search. Try adjusting the filters!</p>
            </div>
          ) : (
            <div className="grid-container" style={grid}>
              {filteredCars.map((car) => (
                <div key={car.id} className="car-card" style={card}>
                  <div style={imageContainer}>
                    <img 
                      src={car.images?.[0]?.image || "https://via.placeholder.com/300x200?text=No+Image"} 
                      alt="car" 
                      style={imageStyle} 
                    />
                    <div style={badgeStyle}>{car.fuel_type}</div>
                  </div>

                  <div style={cardContent}>
                    <p style={brandText}>{car.brand}</p>
                    <h3 style={carTitle}>{car.title}</h3>
                    
                    <div style={priceRow}>
                      <span style={priceText}>₹{car.price.toLocaleString('en-IN')}</span>
                      <span style={locationText}>📍 {car.location}</span>
                    </div>

                    <button
                      style={detailsBtn}
                      onClick={() => navigate(`/buy-car/${car.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 🎨 STYLES
const pageWrapper = {
  background: "#f8fafc",
  minHeight: "100vh",
  padding: "20px 5%",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const headerSection = { marginBottom: "30px" };

const backBtn = {
  background: "none", border: "none", color: "#64748b",
  fontWeight: "600", cursor: "pointer", marginBottom: "8px",
};

const mainTitle = { fontSize: "40px", fontWeight: "800", color: "#0f172a", margin: 0 };

const subtitle = { color: "#64748b", marginTop: "5px" };

const mainLayout = { display: "flex", gap: "25px", alignItems: "flex-start" };

const filterSidebar = {
  width: "280px", background: "#fff", padding: "24px",
  borderRadius: "20px", border: "1px solid #e2e8f0",
  position: "sticky", top: "20px", flexShrink: 0,
};

const filterHeading = { margin: "0 0 20px 0", fontSize: "18px", fontWeight: "700" };

const inputGroup = { marginBottom: "15px" };

const labelStyle = { display: "block", fontSize: "13px", fontWeight: "700", color: "#64748b", marginBottom: "6px" };

const inputStyle = {
  width: "100%", padding: "12px", borderRadius: "10px",
  border: "1px solid #e2e8f0", outline: "none", boxSizing: "border-box",
};

const filterBtn = {
  width: "100%", padding: "12px", background: "#6366f1",
  color: "#fff", border: "none", borderRadius: "10px",
  fontWeight: "700", cursor: "pointer", marginTop: "10px",
};

const gridContainer = { flex: 1 };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "20px",
};

const card = {
  background: "#fff", borderRadius: "20px", overflow: "hidden",
  border: "1px solid #f1f5f9", cursor: "pointer",
};

const imageContainer = { position: "relative", height: "180px" };

const imageStyle = { width: "100%", height: "100%", objectFit: "cover" };

const badgeStyle = {
  position: "absolute", top: "10px", right: "10px",
  background: "rgba(255,255,255,0.9)", padding: "4px 10px",
  borderRadius: "12px", fontSize: "11px", fontWeight: "800", color: "#6366f1",
};

const cardContent = { padding: "15px" };

const brandText = { fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", margin: 0 };

const carTitle = { fontSize: "18px", fontWeight: "700", margin: "4px 0 10px 0" };

const priceRow = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" };

const priceText = { fontSize: "20px", fontWeight: "800", color: "#10b981" };

const locationText = { fontSize: "11px", color: "#94a3b8" };

const detailsBtn = {
  width: "100%", padding: "10px", background: "#f1f5f9",
  borderRadius: "10px", border: "none", fontWeight: "700", cursor: "pointer",
};

const noCarsBox = { padding: "50px", textAlign: "center", background: "#fff", borderRadius: "20px" };

export default BuyCars;