import React, { useState } from "react";
import API from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      // 🔥 FIXED ENDPOINT
      await API.post("auth/verify-otp/", { email, otp });

      alert("OTP Verified ✅");
      navigate("/reset-password", { state: { email } });
    } catch {
      alert("Invalid OTP ❌");
    }
  };

  // --- Inline CSS for Scanner and Pulsing Animations ---
  const otpAnimations = `
    @keyframes scan {
      0% { top: 0%; opacity: 0; }
      50% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    @keyframes pulse-glow {
      0% { box-shadow: 0 0 5px #00d2ff; }
      50% { box-shadow: 0 0 20px #00d2ff, 0 0 30px #3a47ff; }
      100% { box-shadow: 0 0 5px #00d2ff; }
    }
    .scanner-line {
      position: absolute;
      width: 100%;
      height: 2px;
      background: #00d2ff;
      box-shadow: 0 0 15px #00d2ff;
      left: 0;
      animation: scan 2s infinite linear;
      z-index: 5;
      pointer-events: none;
    }
  `;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{otpAnimations}</style>

      <div style={{
        background: "rgba(10, 10, 20, 0.9)",
        backdropFilter: "blur(20px)",
        padding: "50px 40px",
        borderRadius: "30px",
        border: "1px solid rgba(0, 210, 255, 0.3)",
        boxShadow: "0 0 60px rgba(0, 0, 0, 1)",
        width: "100%",
        maxWidth: "380px",
        textAlign: "center",
        position: "relative"
      }}>
        
        {/* Scanner Line */}
        <div className="scanner-line"></div>

        <div style={{ fontSize: "50px", marginBottom: "10px" }}>🛡️</div>

        <h2 style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#ffffff",
          marginBottom: "10px",
          letterSpacing: "-1px"
        }}>
          System <span style={{ color: "#00d2ff" }}>Check</span>
        </h2>

        <p style={{ color: "#8b949e", fontSize: "14px", marginBottom: "30px" }}>
          Check your email <b>{email}</b><br/>
          Enter the 6-digit ignition code.
        </p>

        <div style={{ position: "relative" }}>
          <input
            placeholder="0 0 0 0 0 0"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            style={{
              width: "100%",
              padding: "18px",
              background: "rgba(0, 0, 0, 0.7)",
              border: "2px solid rgba(0, 210, 255, 0.2)",
              borderRadius: "15px",
              color: "#00d2ff",
              outline: "none",
              fontSize: "24px",
              textAlign: "center",
              letterSpacing: "8px",
              fontWeight: "bold",
              boxSizing: "border-box",
              transition: "0.3s"
            }}
          />
        </div>

        <button 
          onClick={handleVerify}
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "30px",
            background: "linear-gradient(135deg, #00d2ff 0%, #3a47ff 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            animation: "pulse-glow 2s infinite ease-in-out",
            textTransform: "uppercase",
            letterSpacing: "2px"
          }}
        >
          Verify Identity
        </button>

        <p style={{
          marginTop: "25px",
          color: "#444",
          fontSize: "12px",
          letterSpacing: "1px"
        }}>
          SECURITY ENCRYPTION ACTIVE
        </p>
      </div>

      {/* Decorative circle */}
      <div style={{
        position: "absolute",
        top: "10%",
        right: "10%",
        width: "200px",
        height: "200px",
        border: "2px dashed rgba(0, 210, 255, 0.1)",
        borderRadius: "50%",
        pointerEvents: "none"
      }}></div>
    </div>
  );
}

export default VerifyOTP;