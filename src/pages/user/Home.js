import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars, getAccessories } from "../../services/api";
import MapView from "../../components/MapView";
function Home() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [activeTab, setActiveTab] = useState("cars"); // "cars" or "accessories"

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCars();
    fetchAccessories();
  }, [navigate]);

  const fetchCars = async () => {
    try {
      const res = await getCars();
      setCars(res.data);
    } catch (err) {
      console.log("Error fetching cars");
    }
  };

  const fetchAccessories = async () => {
    try {
      const res = await getAccessories();
      setAccessories(res.data);
    } catch (err) {
      console.log("Error fetching accessories");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 🔝 NAVBAR */}
      <div style={{
        background: "#fff",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: 0, color: "#0f172a", fontSize: "22px", fontWeight: "800", letterSpacing: "-1px" }}>
          🚗 Auto<span style={{ color: "#6366f1" }}>Drive</span>
        </h2>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/profile")} style={secondaryBtnStyle}>Profile</button>
          <button onClick={() => navigate("/sell-car")} style={secondaryBtnStyle}>Sell Car 🚗</button>
          <button onClick={() => navigate("/buy-cars")} style={secondaryBtnStyle}>Buy Cars 🛒</button>
          <button onClick={() => navigate("/messages")}>
  💬 Messages
</button>
          
          <button onClick={handleLogout} style={{
            padding: "8px 18px",
            border: "none",
            background: "#fee2e2",
            color: "#ef4444",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600"
          }}>Logout</button>
        </div>
      </div>

      {/* 🔍 SEARCH & CATEGORY SELECTOR */}
      <div style={{ padding: "50px 40px 40px", textAlign: "center", background: "#fff", borderBottom: "1px solid #f1f5f9" }}>
        <h1 style={{ margin: "0 0 10px 0", fontSize: "36px", fontWeight: "800", color: "#1e293b" }}>
          Find Your Perfect Ride 🚀
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "32px" }}>
          Rent or buy from our curated collection of vehicles and gear.
        </p>

        {/* 🛠️ NAVIGATION TOGGLE */}
        <div style={{ display: "inline-flex", background: "#f1f5f9", padding: "6px", borderRadius: "14px", marginBottom: "30px" }}>
          <button 
            onClick={() => setActiveTab("cars")}
            style={{
              padding: "10px 24px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              transition: "0.2s",
              backgroundColor: activeTab === "cars" ? "#fff" : "transparent",
              color: activeTab === "cars" ? "#6366f1" : "#64748b",
              boxShadow: activeTab === "cars" ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
            }}
          >
            🚗 Cars
          </button>
          <button 
            onClick={() => setActiveTab("accessories")}
            style={{
              padding: "10px 24px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              transition: "0.2s",
              backgroundColor: activeTab === "accessories" ? "#fff" : "transparent",
              color: activeTab === "accessories" ? "#6366f1" : "#64748b",
              boxShadow: activeTab === "accessories" ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
            }}
          >
            🛒 Accessories
          </button>
        </div>

        <div>
          <input
            placeholder={`Search for ${activeTab}...`}
            style={{
              padding: "14px 20px",
              width: "400px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              outline: "none",
              fontSize: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
            }}
          />
        </div>
      </div>

      {/* 🗺️ NEARBY CARS MAP SECTION */}
      {activeTab === "cars" && (
        <div style={{ padding: "40px 40px 0 40px" }}>
           <h2 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "22px" }}>Nearby Cars 📍</h2>
           <div style={{ borderRadius: "18px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 4px 10px rgba(0,0,0,0.03)" }}>
              <MapView />
           </div>
        </div>
      )}

      {/* 📦 LISTING CONTENT */}
      <div style={{ padding: "40px" }}>
        
        {activeTab === "cars" ? (
          <>
            <h2 style={{ margin: "0 0 25px 0", color: "#0f172a", fontSize: "22px" }}>Available Vehicles</h2>
            <div style={gridStyle}>
              {cars.map((car) => (
                <div key={car.id} style={cardStyle}>
                  <div style={{ position: "relative" }}>
                    {car.images && car.images.length > 0 ? (
                      <img src={car.images[0].image} alt="car" style={imageStyle} />
                    ) : (
                      <div style={{ ...imageStyle, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>🚘</div>
                    )}
                    <div style={priceBadgeStyle("#6366f1")}>₹{car.price}<span style={{ fontSize: "10px", opacity: 0.8 }}>/day</span></div>
                  </div>
                  <div style={{ padding: "18px" }}>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "#1e293b" }}>{car.title}</h3>
                    <p style={{ margin: "0 0 16px 0", color: "#94a3b8", fontSize: "14px" }}>{car.brand}</p>
                    <button 
                      onClick={() => navigate(`/car/${car.id}`)}
                      style={detailBtnStyle("#6366f1")}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 style={{ margin: "0 0 25px 0", color: "#0f172a", fontSize: "22px" }}>Premium Accessories</h2>
            <div style={gridStyle}>
              {accessories.map((item) => (
                <div key={item.id} style={cardStyle}>
                  <div style={{ position: "relative" }}>
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0].image} alt="acc" style={imageStyle} />
                    ) : (
                      <div style={{ ...imageStyle, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>🛠️</div>
                    )}
                    <div style={priceBadgeStyle("#10b981")}>₹{item.price}</div>
                  </div>
                  <div style={{ padding: "18px" }}>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "#1e293b" }}>{item.name}</h3>
                    <p style={{ margin: "0 0 16px 0", color: "#94a3b8", fontSize: "14px" }}>{item.brand}</p>
                    <button 
                      onClick={() => navigate(`/accessory/${item.id}`)}
                      style={detailBtnStyle("#10b981")}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 💬 FLOATING CHAT BUTTON */}
      <div
        onClick={() => navigate("/chatbot")}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          background: "#6366f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "22px",
          cursor: "pointer",
          boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
          zIndex: 999
        }}
      >
        💬
      </div>
    </div>
  );
}

// 🎨 Common Styles
const secondaryBtnStyle = {
  padding: "8px 18px",
  border: "1px solid #e2e8f0",
  background: "#fff",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  color: "#475569"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "30px"
};

const cardStyle = {
  background: "#fff",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  border: "1px solid #f1f5f9",
  transition: "transform 0.2s ease"
};

const imageStyle = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
};

const priceBadgeStyle = (bgColor) => ({
  position: "absolute",
  bottom: "12px",
  right: "12px",
  backgroundColor: bgColor,
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "14px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
});

const detailBtnStyle = (bgColor) => ({
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  background: bgColor,
  color: "#fff",
  fontWeight: "700",
  fontSize: "14px",
  cursor: "pointer",
  boxShadow: `0 4px 12px ${bgColor}33`
});

export default Home;