import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

function BuyCarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    fetchCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await API.get("cars/market/");
      const selected = res.data.find((c) => c.id === parseInt(id));
      setCar(selected);
    } catch (err) {
      console.log("Error fetching car details:", err);
    }
  };

  const handleWhatsAppContact = () => {
    if (!car?.whatsapp_number) {
      alert("Seller has not provided a WhatsApp number.");
      return;
    }
    // Formats the number: removes spaces/plus signs if any
    const cleanNumber = car.whatsapp_number.replace(/\D/g, "");
    const message = `Hello! I saw your listing for the *${car.title}* (₹${car.price}) on the Car App. Is it still available?`;
    
    // Opens WhatsApp Web or App directly
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (!car) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontFamily: "sans-serif" }}>
      <div className="loader">Loading Excellence...</div>
    </div>
  );

  return (
    <div style={pageWrapper}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
          
          .back-link:hover { color: #6366f1 !important; transform: translateX(-4px); }
          .feature-badge {
            background: #f1f5f9;
            padding: 8px 12px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .contact-btn:hover { background: #1fb355 !important; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(37, 211, 102, 0.3); }
          .contact-btn:active { transform: translateY(0); }
        `}
      </style>

      {/* Navigation Header */}
      <div style={topNav}>
        <button onClick={() => navigate(-1)} className="back-link" style={backBtn}>
          ← Back to Marketplace
        </button>
      </div>

      <div style={contentGrid}>
        {/* LEFT COLUMN: IMAGE GALLERY */}
        <div style={imageSection}>
          <div style={mainImageContainer}>
            <img
              src={car.images?.[0]?.image || "https://via.placeholder.com/600x400?text=No+Image"}
              alt={car.title}
              style={mainImageStyle}
            />
            <div style={priceTag}>₹{car.price.toLocaleString('en-IN')}</div>
          </div>
          
          {/* Thumbnails if available */}
          {car.images?.length > 1 && (
            <div style={thumbnailRow}>
              {car.images.map((img, index) => (
                <img key={index} src={img.image} style={thumbStyle} alt="thumb" />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div style={detailsSection}>
          <div style={{ marginBottom: "20px" }}>
            <span style={brandLabel}>{car.brand}</span>
            <h1 style={titleStyle}>{car.title}</h1>
            <p style={locationStyle}>📍 {car.location}</p>
          </div>

          <div style={statsGrid}>
            <div className="feature-badge">⛽ {car.fuel_type}</div>
            <div className="feature-badge">⚙️ Manual/Auto</div>
            <div className="feature-badge">🛣️ {car.kms_driven || "0"} KM</div>
          </div>

          <div style={descriptionBox}>
            <h3 style={sectionTitle}>Description</h3>
            <p style={descText}>{car.description || "No description provided for this vehicle."}</p>
          </div>

          {/* SELLER CARD */}
          <div style={sellerCard}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
              <div style={avatar}>{car.seller?.name?.charAt(0) || "S"}</div>
              <div>
                <p style={sellerName}>{car.seller?.name || "Verified Seller"}</p>
                <p style={sellerEmail}>{car.seller?.email}</p>
              </div>
            </div>
            
            <button onClick={handleWhatsAppContact} className="contact-btn" style={whatsappBtn}>
              <span style={{ fontSize: "20px" }}>💬</span> 
              Contact on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎨 STYLES
const pageWrapper = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  color: "#1e293b",
};

const topNav = {
  padding: "10px 0 30px 0",
};

const backBtn = {
  background: "none",
  border: "none",
  color: "#64748b",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
};

const contentGrid = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: "40px",
  alignItems: "start",
};

const imageSection = {
  position: "sticky",
  top: "20px",
};

const mainImageContainer = {
  position: "relative",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
};

const mainImageStyle = {
  width: "100%",
  height: "500px",
  objectFit: "cover",
  display: "block",
};

const priceTag = {
  position: "absolute",
  bottom: "20px",
  left: "20px",
  background: "#fff",
  padding: "10px 20px",
  borderRadius: "14px",
  fontWeight: "800",
  fontSize: "24px",
  color: "#059669",
  boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
};

const thumbnailRow = {
  display: "flex",
  gap: "10px",
  marginTop: "15px",
};

const thumbStyle = {
  width: "80px",
  height: "60px",
  borderRadius: "8px",
  objectFit: "cover",
  cursor: "pointer",
  border: "2px solid transparent",
};

const detailsSection = {
  display: "flex",
  flexDirection: "column",
};

const brandLabel = {
  textTransform: "uppercase",
  letterSpacing: "1px",
  fontSize: "12px",
  fontWeight: "800",
  color: "#6366f1",
};

const titleStyle = {
  fontSize: "36px",
  fontWeight: "800",
  margin: "5px 0",
  lineHeight: "1.1",
};

const locationStyle = {
  color: "#64748b",
  fontSize: "14px",
  margin: 0,
};

const statsGrid = {
  display: "flex",
  gap: "10px",
  margin: "25px 0",
};

const descriptionBox = {
  borderTop: "1px solid #e2e8f0",
  paddingTop: "20px",
  marginBottom: "30px",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "10px",
};

const descText = {
  lineHeight: "1.6",
  color: "#475569",
};

const sellerCard = {
  background: "#f8fafc",
  padding: "25px",
  borderRadius: "24px",
  border: "1px solid #e2e8f0",
};

const avatar = {
  width: "50px",
  height: "50px",
  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: "700",
  fontSize: "20px",
};

const sellerName = {
  margin: 0,
  fontWeight: "700",
  fontSize: "16px",
};

const sellerEmail = {
  margin: 0,
  fontSize: "13px",
  color: "#64748b",
};

const whatsappBtn = {
  width: "100%",
  padding: "16px",
  background: "#25D366",
  color: "#fff",
  border: "none",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  transition: "all 0.3s",
};

export default BuyCarDetails;