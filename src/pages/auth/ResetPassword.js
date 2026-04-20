import React, { useState } from "react";
import API from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleReset = async () => {
    try {
      await API.post("reset-password/", { email, password });
      alert("Password reset successful 🔥");
      navigate("/login");
    } catch {
      alert("Error ❌");
    }
  };

  // --- Variety Animations: Rotating Wheel & Success Pulse ---
  const resetAnimations = `
    @keyframes spin-wheel {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes bar-fill {
      from { width: 0%; }
      to { width: 100%; }
    }
    .rotating-rim {
      position: absolute;
      top: -100px;
      right: -100px;
      font-size: 300px;
      opacity: 0.05;
      animation: spin-wheel 20s linear infinite;
      pointer-events: none;
    }
    .password-strength {
      height: 4px;
      background: #00d2ff;
      box-shadow: 0 0 10px #00d2ff;
      transition: width 0.5s ease;
      border-radius: 2px;
      margin-top: 5px;
    }
  `;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{resetAnimations}</style>

      {/* 🎡 Background Decorative Wheel */}
      <div className="rotating-rim">⚙️</div>

      <div style={{
        background: "rgba(10, 10, 15, 0.9)",
        backdropFilter: "blur(25px)",
        padding: "50px 40px",
        borderRadius: "32px",
        border: "1px solid rgba(0, 210, 255, 0.25)",
        boxShadow: "0 0 80px rgba(0, 0, 0, 0.9)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        zIndex: 5
      }}>
        <div style={{ fontSize: "50px", marginBottom: "15px" }}>🔧</div>
        
        <h2 style={{
          fontSize: "30px",
          fontWeight: "800",
          color: "#ffffff",
          marginBottom: "10px",
          letterSpacing: "-1px"
        }}>
          New <span style={{ color: "#00d2ff" }}>Configuration</span>
        </h2>
        
        <p style={{ color: "#8b949e", fontSize: "14px", marginBottom: "35px" }}>
          Re-securing access for:<br/>
          <span style={{ color: "#fff" }}>{email}</span>
        </p>

        <div style={{ textAlign: "left" }}>
          <label style={{ color: "#00d2ff", fontSize: "11px", fontWeight: "bold", marginLeft: "5px" }}>
            SET NEW MASTER PASSWORD
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "10px",
              background: "rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(0, 210, 255, 0.4)",
              borderRadius: "12px",
              color: "#ffffff",
              outline: "none",
              fontSize: "18px",
              boxSizing: "border-box"
            }}
          />
          {/* 🔋 Password Progress Bar UI */}
          <div className="password-strength" style={{ 
            width: password.length > 0 ? `${Math.min(password.length * 10, 100)}%` : '0%' 
          }}></div>
        </div>

        <button 
          onClick={handleReset}
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "35px",
            background: "linear-gradient(135deg, #00d2ff 0%, #3a47ff 100%)",
            color: "white",
            border: "none",
            borderRadius: "14px",
            fontWeight: "800",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(0, 210, 255, 0.3)",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
        >
          UPDATE SYSTEM 🔓
        </button>

        <div style={{ 
          marginTop: "20px", 
          display: "flex", 
          justifyContent: "center", 
          gap: "10px", 
          opacity: 0.5 
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d2ff" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d2ff" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d2ff" }}></div>
        </div>
      </div>

      {/* 🛣️ Animated Road Stripes */}
      <div style={{
        position: "absolute",
        top: "0",
        left: "5%",
        width: "1px",
        height: "100%",
        background: "linear-gradient(to bottom, transparent, rgba(0,210,255,0.2), transparent)"
      }}></div>
    </div>
  );
}

export default ResetPassword;