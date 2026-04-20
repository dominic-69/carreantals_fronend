import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- 🛠️ FIX FOR LEAFLET ICONS ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const userIcon = L.divIcon({
  className: "custom-user-icon",
  html: '<div class="blue-dot"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const carIcon = L.divIcon({
  className: "custom-car-icon",
  html: '<div class="red-dot"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, { duration: 1.5 });
  }, [center, map]);
  return null;
}

function MapView() {
  const [cars, setCars] = useState([]);
  const [userLocation, setUserLocation] = useState([10.8505, 76.2711]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => console.error("Location error:", error)
    );
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/cars/")
      .then((res) => res.json())
      .then((data) => {
          const validCars = data.filter(car => car.latitude && car.longitude);
          setCars(validCars);
      })
      .catch((err) => console.error(err));
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.6); }
            70% { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
          }
          
          .blue-dot {
            width: 14px; height: 14px;
            background-color: #6366f1;
            border: 3px solid white;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          
          .red-dot {
            width: 12px; height: 12px;
            background-color: #f43f5e;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .custom-car-icon:hover .red-dot {
            transform: scale(1.5);
            background-color: #e11d48;
          }

          /* Hide Scrollbar for cleaner look */
          .scroll-container::-webkit-scrollbar { width: 5px; }
          .scroll-container::-webkit-scrollbar-track { background: transparent; }
          .scroll-container::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

          .leaflet-container { font-family: 'Plus Jakarta Sans', sans-serif !important; }
          .leaflet-popup-content-wrapper { border-radius: 16px; padding: 4px; border: 1px solid #f1f5f9; }
        `}
      </style>

      {/* 🟢 SIDEBAR INFO PANEL */}
      <div style={sidebarStyle}>
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ margin: 0, color: "#0f172a", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" }}>
            Car Discovery
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></div>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>{cars.length} Vehicles nearby</span>
          </div>
        </div>
        
        <div className="scroll-container" style={scrollArea}>
          {cars.length > 0 ? (
            cars.map(car => (
              <div key={car.id} style={miniCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>{car.title}</span>
                  <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "800" }}>₹{car.price}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{car.brand || "Sedan"}</span>
                  <span style={{ fontSize: "11px", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", color: "#475569" }}>
                    {getDistance(userLocation[0], userLocation[1], car.latitude, car.longitude).toFixed(1)} km
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "24px" }}>🔍</div>
              <p style={{ fontSize: "13px", color: "#94a3b8" }}>Searching for cars...</p>
            </div>
          )}
        </div>
      </div>

      {/* 🌍 MAP CONTAINER */}
      <div style={mapWrapper}>
        <MapContainer
          center={userLocation}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false} // Clean UI, move it later or leave off
        >
          <ChangeMapView center={userLocation} />
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
            attribution='&copy; CARTO'
          />

          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div style={{ textAlign: "center", fontWeight: "700", color: "#6366f1" }}>You are here</div>
            </Popup>
          </Marker>

          {cars.map((car) => (
            <Marker key={car.id} position={[car.latitude, car.longitude]} icon={carIcon}>
              <Popup>
                <div style={popupContent}>
                  <div style={{ fontSize: "11px", color: "#6366f1", fontWeight: "800", textTransform: "uppercase" }}>{car.brand}</div>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>{car.title}</div>
                  <div style={{ fontSize: "14px", color: "#475569", fontWeight: "600" }}>₹{car.price} <span style={{ fontWeight: "400", fontSize: "12px" }}>/ day</span></div>
                  <hr style={{ border: "0.5px solid #f1f5f9", margin: "10px 0" }} />
                  <button style={popupBtn}>Details</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

// 🎨 REDESIGNED STYLES
const containerStyle = {
  display: "flex",
  height: "650px",
  width: "100%",
  borderRadius: "32px",
  overflow: "hidden",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
  background: "#fff",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  border: "8px solid #fff"
};

const sidebarStyle = {
  width: "320px",
  background: "#ffffff",
  padding: "30px 20px",
  borderRight: "1px solid #f1f5f9",
  display: "flex",
  flexDirection: "column",
  zIndex: 10
};

const scrollArea = {
  flex: 1,
  overflowY: "auto",
  paddingRight: "4px"
};

const miniCard = {
  padding: "16px",
  background: "#ffffff",
  borderRadius: "18px",
  marginBottom: "12px",
  border: "1px solid #f1f5f9",
  transition: "all 0.2s ease",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
};

const mapWrapper = {
  flex: 1,
  position: "relative"
};

const popupContent = {
  padding: "8px",
  minWidth: "160px"
};

const popupBtn = {
  padding: "10px 0",
  width: "100%",
  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "13px",
  cursor: "pointer",
  fontWeight: "700",
  boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)"
};

export default MapView;