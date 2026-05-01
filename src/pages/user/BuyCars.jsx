import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function BuyCars() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  // 🔥 Integrated Search & Price Filter Logic
  useEffect(() => {
    let temp = cars.filter((car) => {
      const matchesSearch = car.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            car.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = maxPrice === "" || car.price <= parseInt(maxPrice);
      return matchesSearch && matchesPrice;
    });
    setFilteredCars(temp);
  }, [searchQuery, maxPrice, cars]);

  return (
    <div style={pageWrapper}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
          
          .car-card { transition: all 0.3s ease; border: 1px solid #f1f5f9; }
          .car-card:hover { transform: translateY(-8px); border-color: #6366f1 !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08); }
          
          .search-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
          
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #f8fafc; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; borderRadius: 10px; }
        `}
      </style>

      {/* 🔝 HEADER SECTION */}
      <div style={headerSection}>
        <button onClick={() => navigate("/")} style={backBtn}>← Back to Home</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={mainTitle}>Vehicle <span style={{ color: "#6366f1" }}>Market</span></h1>
            <p style={subtitle}>Explore {filteredCars.length} premium cars available for purchase.</p>
          </div>
          
          {/* 🔍 SEARCH & PRICE BAR */}
          <div style={filterBar}>
            <div style={searchWrapper}>
                <span style={{marginRight: '10px'}}>🔍</span>
                <input 
                    type="text" 
                    placeholder="Search model or brand..." 
                    className="search-input"
                    style={searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div style={priceWrapper}>
                <span style={labelSmall}>Budget:</span>
                <input 
                    type="number" 
                    placeholder="Max Price" 
                    style={priceInput}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>
          </div>
        </div>
      </div>

      {/* 🚗 GRID SECTION */}
      <div style={gridContainer}>
        {filteredCars.length === 0 ? (
          <div style={noCarsBox}>
            <h2 style={{color: '#94a3b8'}}>No vehicles found</h2>
            <p style={{color: '#cbd5e1'}}>Try adjusting your search or budget.</p>
            <button onClick={() => {setSearchQuery(""); setMaxPrice("");}} style={resetBtn}>Reset All</button>
          </div>
        ) : (
          <div style={grid}>
            {filteredCars.map((car) => (
              <div key={car.id} className="car-card" style={card} onClick={() => navigate(`/buy-car/${car.id}`)}>
                <div style={imageContainer}>
                  <img 
                    src={car.images?.[0]?.image || "https://via.placeholder.com/400x250"} 
                    alt="car" 
                    style={imageStyle} 
                  />
                  <div style={locBadge}>📍 {car.location}</div>
                </div>

                <div style={cardContent}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <div>
                        <p style={brandText}>{car.brand}</p>
                        <h3 style={carTitle}>{car.title}</h3>
                    </div>
                  </div>
                  
                  <div style={divider}></div>

                  <div style={priceRow}>
                    <div>
                        <p style={labelSmall}>Current Price</p>
                        <span style={priceText}>₹{car.price.toLocaleString('en-IN')}</span>
                    </div>
                    <button style={detailsBtn}>Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 STYLES
const pageWrapper = {
  background: "#f8fafc",
  minHeight: "100vh",
  padding: "40px 5%",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const headerSection = { marginBottom: "40px" };

const backBtn = {
  background: "#fff", border: "1px solid #e2e8f0", color: "#64748b",
  padding: "8px 16px", borderRadius: "10px",
  fontWeight: "600", cursor: "pointer", marginBottom: "20px",
};

const mainTitle = { fontSize: "40px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: '-1.5px' };
const subtitle = { color: "#64748b", marginTop: "5px", fontSize: '16px' };

const filterBar = { display: 'flex', gap: '15px', background: '#fff', padding: '10px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' };
const searchInput = { border: 'none', outline: 'none', fontSize: '14px', width: '200px' };
const searchWrapper = { display: 'flex', alignItems: 'center', padding: '0 15px', borderRight: '1px solid #f1f5f9' };
const priceWrapper = { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 10px' };
const priceInput = { border: 'none', outline: 'none', width: '100px', fontWeight: '700', color: '#6366f1' };

const gridContainer = { width: '100%' };
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "30px",
};

const card = {
  background: "#fff", borderRadius: "24px", overflow: "hidden", cursor: "pointer",
};

const imageContainer = { position: "relative", height: "200px" };
const imageStyle = { width: "100%", height: "100%", objectFit: "cover" };
const locBadge = {
    position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15,23,42,0.7)',
    backdropFilter: 'blur(4px)', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600'
};

const cardContent = { padding: "20px" };
const brandText = { fontSize: "12px", fontWeight: "800", color: "#6366f1", textTransform: "uppercase", margin: 0 };
const carTitle = { fontSize: "20px", fontWeight: "700", margin: "4px 0 0 0", color: '#1e293b' };
const divider = { height: '1px', background: '#f1f5f9', margin: '15px 0' };

const priceRow = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const labelSmall = { fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px', display: 'block' };
const priceText = { fontSize: "22px", fontWeight: "800", color: "#0f172a" };

const detailsBtn = {
  padding: "10px 20px", background: "#0f172a", color: '#fff',
  borderRadius: "12px", border: "none", fontWeight: "700", cursor: "pointer",
};

const resetBtn = { marginTop: '20px', padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' };
const noCarsBox = { padding: "100px", textAlign: "center", background: "#fff", borderRadius: "30px", width: '100%' };

export default BuyCars;