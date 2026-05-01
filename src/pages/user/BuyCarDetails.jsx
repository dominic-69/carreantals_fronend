/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

function BuyCarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [messageSent, setMessageSent] = useState(false);
  
  // 🔥 State to track which image is currently being viewed
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchCar();
    // eslint-disable-next-line
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

  const handleChat = async () => {
    try {
      if (!car) {
        alert("Car data not loaded ❌");
        return;
      }
      const sellerId = car?.seller?.id;
      if (!sellerId) {
        alert("Seller ID not found ❌");
        return;
      }

      const res = await API.post("chat/userchat/create/", {
        user_id: sellerId,
      });

      const chatId = res.data.chat_id;
      await API.post(`chat/userchat/${chatId}/send/`, {
        message: "Is this still available?",
      });

      setMessageSent(true);

      setTimeout(() => {
        navigate(`/messages?chat_id=${chatId}`);
      }, 500);

    } catch (err) {
      console.error("Error:", err.response?.data || err);
      alert("Could not start chat ❌");
    }
  };

  const handleWhatsAppContact = () => {
    if (!car?.whatsapp_number) {
      alert("Seller has not provided a WhatsApp number.");
      return;
    }
    const cleanNumber = car.whatsapp_number.replace(/\D/g, "");
    const message = `Hello! I saw your listing for the *${car.title}* (₹${car.price}) on the Car App. Is it still available?`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (!car)
    return (
      <div style={styles.loadingWrapper}>
        <div className="spinner"></div>
        <p>Fetching Vehicle Specifications...</p>
      </div>
    );

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        .back-btn:hover { color: #6366f1 !important; transform: translateX(-5px); }
        .action-btn { transition: all 0.3s ease; }
        .action-btn:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .spinner { border: 4px solid #f3f4f6; border-top: 4px solid #6366f1; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        /* 🔥 Thumbnail Hover Effect */
        .thumb-item { transition: all 0.2s ease; cursor: pointer; border: 2px solid transparent; }
        .thumb-item:hover { transform: scale(1.05); }
        .thumb-active { border-color: #6366f1 !important; opacity: 1 !important; }
      `}</style>

      <div style={styles.topNav}>
        <button onClick={() => navigate(-1)} className="back-btn" style={styles.backBtn}>
          ← Back to Marketplace
        </button>
      </div>

      <div style={styles.contentGrid}>
        {/* LEFT: VISUALS */}
        <div style={styles.imageSection}>
          <div style={styles.imageContainer}>
            <img
              src={car.images?.[activeImage]?.image || "https://via.placeholder.com/800x600?text=No+Vehicle+Image"}
              alt={car.title}
              style={styles.mainImage}
            />
            <div style={styles.priceTag}>₹{car.price.toLocaleString('en-IN')}</div>
          </div>

          {/* 🔥 IMAGE GALLERY THUMBNAILS */}
          {car.images?.length > 1 && (
            <div style={styles.thumbGallery}>
              {car.images.map((img, index) => (
                <img
                  key={img.id || index}
                  src={img.image}
                  alt={`thumbnail-${index}`}
                  className={`thumb-item ${activeImage === index ? 'thumb-active' : ''}`}
                  onClick={() => setActiveImage(index)}
                  style={{
                    ...styles.thumbImg,
                    opacity: activeImage === index ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          )}
          
          <div style={styles.specOverview}>
            <div style={styles.specItem}><span>Fuel</span><strong>{car.fuel_type || 'N/A'}</strong></div>
            <div style={styles.specItem}><span>Location</span><strong>{car.location}</strong></div>
            <div style={styles.specItem}><span>Brand</span><strong>{car.brand}</strong></div>
          </div>
        </div>

        {/* RIGHT: DETAILS & CONTACT */}
        <div style={styles.detailsSection}>
          <div style={styles.infoHead}>
            <span style={styles.brandLabel}>{car.brand}</span>
            <h1 style={styles.titleText}>{car.title}</h1>
          </div>

          <div style={styles.descriptionCard}>
            <h3 style={styles.subHeading}>Description</h3>
            <p style={styles.descriptionText}>{car.description || "No description provided for this vehicle."}</p>
          </div>

          <div style={styles.sellerCard}>
            <h3 style={styles.subHeading}>Seller Information</h3>
            <div style={styles.sellerInfoRow}>
                <div style={styles.avatar}>{car.seller?.name?.[0] || 'S'}</div>
                <div>
                    <div style={styles.sellerName}>{car.seller?.name}</div>
                    <div style={styles.sellerEmail}>{car.seller?.email}</div>
                </div>
            </div>

            <div style={styles.actionGroup}>
                <button 
                    onClick={handleChat} 
                    className="action-btn" 
                    style={{...styles.chatBtn, background: messageSent ? '#10b981' : '#6366f1'}}
                >
                  {messageSent ? "Message Sent ✅" : "Inquire via Chat"}
                </button>

                <button onClick={handleWhatsAppContact} className="action-btn" style={styles.whatsappBtn}>
                  <img src="https://img.icons8.com/color/24/whatsapp--v1.png" alt="wa" style={{marginRight: '10px'}}/>
                  WhatsApp Contact
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyCarDetails;

const styles = {
  pageWrapper: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "40px 20px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: "#1e293b",
    minHeight: "100vh"
  },
  loadingWrapper: {
    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh", color: "#64748b"
  },
  topNav: { marginBottom: "30px" },
  backBtn: {
    border: "none", background: "none", cursor: "pointer", fontWeight: "700", color: "#64748b", transition: "all 0.2s", fontSize: "15px"
  },
  contentGrid: {
    display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "50px", alignItems: "start"
  },
  imageSection: { position: "sticky", top: "20px" },
  imageContainer: { position: "relative", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" },
  mainImage: { width: "100%", height: "500px", objectFit: "cover", display: "block", transition: "0.3s ease" },
  
  // 🔥 Thumbnail Gallery Styles
  thumbGallery: { display: "flex", gap: "10px", marginTop: "15px", overflowX: "auto", paddingBottom: "5px" },
  thumbImg: { width: "80px", height: "60px", objectFit: "cover", borderRadius: "10px", background: "#f1f5f9" },

  priceTag: {
    position: "absolute", bottom: "20px", right: "20px", background: "#fff", padding: "12px 24px", borderRadius: "16px",
    fontSize: "24px", fontWeight: "800", color: "#6366f1", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },
  specOverview: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginTop: "20px"
  },
  specItem: {
    background: "#f8fafc", padding: "15px", borderRadius: "16px", textAlign: "center", border: "1px solid #f1f5f9"
  },
  brandLabel: { color: "#6366f1", fontWeight: "800", textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px" },
  titleText: { fontSize: "42px", fontWeight: "800", margin: "5px 0 20px 0", color: "#0f172a", letterSpacing: "-1.5px" },
  descriptionCard: { marginBottom: "30px" },
  subHeading: { fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "#334155" },
  descriptionText: { lineHeight: "1.8", color: "#64748b", fontSize: "16px" },
  sellerCard: {
    background: "#fff", padding: "30px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
  },
  sellerInfoRow: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px" },
  avatar: { 
    width: "50px", height: "50px", background: "#f1f5f9", borderRadius: "12px", display: "flex", 
    alignItems: "center", justifyContent: "center", fontWeight: "800", color: "#6366f1", fontSize: "20px" 
  },
  sellerName: { fontWeight: "700", fontSize: "18px" },
  sellerEmail: { color: "#94a3b8", fontSize: "14px" },
  actionGroup: { display: "flex", flexDirection: "column", gap: "12px" },
  chatBtn: {
    width: "100%", padding: "16px", color: "#fff", border: "none", borderRadius: "14px", 
    fontWeight: "700", cursor: "pointer", fontSize: "16px"
  },
  whatsappBtn: {
    width: "100%", padding: "16px", background: "#fff", color: "#25D366", border: "2px solid #25D366", 
    borderRadius: "14px", fontWeight: "700", cursor: "pointer", fontSize: "16px", display: "flex", 
    alignItems: "center", justifyContent: "center"
  }
};