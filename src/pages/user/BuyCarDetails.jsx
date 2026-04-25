/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

function BuyCarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [messageSent, setMessageSent] = useState(false);

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

  // 🔥 FIXED CHAT FUNCTION (FINAL VERSION)
  const handleChat = async () => {
    try {
      if (!car) {
        alert("Car data not loaded ❌");
        return;
      }

      const sellerId = car?.seller?.id;

      if (!sellerId) {
        console.log("CAR:", car);
        alert("Seller ID not found ❌");
        return;
      }

      // 🔥 STEP 1: CREATE OR GET CHAT
      const res = await API.post("chat/userchat/create/", {
        user_id: sellerId,
      });

      const chatId = res.data.chat_id;

      // 🔥 STEP 2: SEND DEFAULT MESSAGE (IMPORTANT FIX)
      await API.post(`chat/userchat/${chatId}/send/`, {
        message: "Is this still available?",
      });

      // 🔥 STEP 3: UPDATE BUTTON UI
      setMessageSent(true);

      // 🔥 STEP 4: REDIRECT TO CHAT PAGE
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

    window.open(
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (!car)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        Loading...
      </div>
    );

  return (
    <div style={pageWrapper}>
      <div style={topNav}>
        <button onClick={() => navigate(-1)} style={backBtn}>
          ← Back to Marketplace
        </button>
      </div>

      <div style={contentGrid}>
        {/* IMAGE */}
        <div style={imageSection}>
          <img
            src={car.images?.[0]?.image || "https://via.placeholder.com/600"}
            alt={car.title}
            style={mainImageStyle}
          />
        </div>

        {/* DETAILS */}
        <div style={detailsSection}>
          <h1>{car.title}</h1>
          <p>📍 {car.location}</p>
          <h2>₹{car.price}</h2>

          <p>{car.description}</p>

          {/* SELLER */}
          <div style={sellerCard}>
            <p><b>{car.seller?.name}</b></p>
            <p>{car.seller?.email}</p>

            {/* 🔥 CHAT BUTTON */}
            <button onClick={handleChat} style={chatBtnStyle}>
              {messageSent ? "Message Sent ✅" : "Is this still available?"}
            </button>

            {/* WHATSAPP */}
            <button onClick={handleWhatsAppContact} style={whatsappBtn}>
              Contact on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyCarDetails;



// ================= STYLES =================

const pageWrapper = {
  maxWidth: "1100px",
  margin: "auto",
  padding: "20px",
};

const topNav = {
  marginBottom: "20px",
};

const backBtn = {
  border: "none",
  background: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

const contentGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "30px",
};

const imageSection = {};

const mainImageStyle = {
  width: "100%",
  borderRadius: "10px",
};

const detailsSection = {};

const sellerCard = {
  marginTop: "20px",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
};

const chatBtnStyle = {
  width: "100%",
  padding: "12px",
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
  cursor: "pointer",
};

const whatsappBtn = {
  width: "100%",
  padding: "12px",
  background: "#25D366",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
  cursor: "pointer",
};