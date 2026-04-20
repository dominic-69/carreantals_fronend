import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      // 🔥 FIXED ENDPOINT
      await API.post("auth/send-otp/", { email });

      alert("OTP sent 📧");
      navigate("/verify-otp", { state: { email } });
    } catch {
      alert("Error sending OTP ❌");
    }
  };

  // --- Inline CSS for the Driving Car Animation ---
  const carAnimationStyle = `
    @keyframes drive {
      0% { transform: translateX(-150%) scaleX(1); }
      50% { transform: translateX(50%) scaleX(1); }
      100% { transform: translateX(1200%) scaleX(1); }
    }
    .moving-car {
      position: absolute;
      bottom: 20px;
      left: 0;
      font-size: 40px;
      animation: drive 3s infinite linear;
    }
  `;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?q=80&w=2070&auto=format&fit=crop')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "'Inter', sans-serif",
      overflow: "hidden",
      position: "relative"
    }}>
      
      <style>{carAnimationStyle}</style>

      {/* 🏎️ Animated Car */}
      <div className="moving-car">🏎️💨</div>

      <div style={{
        background: "rgba(10, 10, 15, 0.9)",
        backdropFilter: "blur(20px)",
        padding: "50px 40px",
        borderRadius: "30px",
        border: "1px solid rgba(0, 210, 255, 0.2)",
        boxShadow: "0 0 50px rgba(0, 210, 255, 0.15)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        zIndex: 2
      }}>
        
        <div style={{ fontSize: "50px", marginBottom: "10px" }}>🔑</div>

        <h2 style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#ffffff",
          marginBottom: "10px",
          letterSpacing: "-1px"
        }}>
          Lost your <span style={{ color: "#00d2ff" }}>Keys?</span>
        </h2>

        <p style={{ color: "#8b949e", fontSize: "14px", marginBottom: "30px" }}>
          Enter your email to receive a secure OTP and get back on the road.
        </p>

        <div style={{ textAlign: "left" }}>
          <label style={{ color: "#00d2ff", fontSize: "11px", fontWeight: "bold", marginLeft: "5px" }}>
            RECOVERY EMAIL
          </label>

          <input
            placeholder="driver@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "8px",
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(0, 210, 255, 0.4)",
              borderRadius: "12px",
              color: "#ffffff",
              outline: "none",
              fontSize: "16px",
              boxSizing: "border-box",
              boxShadow: "inset 0 0 10px rgba(0, 210, 255, 0.1)"
            }}
          />
        </div>

        <button 
          onClick={handleSendOTP}
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "30px",
            background: "linear-gradient(135deg, #3a47ff 0%, #00d2ff 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 10px 20px rgba(58, 71, 255, 0.3)",
            transition: "0.3s"
          }}
        >
          SEND OTP 🚀
        </button>

        <p 
          onClick={() => navigate("/login")}
          style={{
            marginTop: "25px",
            color: "#8b949e",
            fontSize: "13px",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Wait, I remembered my password!
        </p>
      </div>

      {/* Road Line */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        width: "100%",
        height: "2px",
        background: "repeating-linear-gradient(90deg, #333, #333 40px, transparent 40px, transparent 80px)"
      }}></div>
    </div>
  );
}

export default ForgotPassword;