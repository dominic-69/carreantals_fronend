/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [old_password, setOld] = useState("");
  const [new_password, setNew] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      // 🔥 FIXED ENDPOINT
      await API.post("auth/change-password/", {
        old_password,
        new_password,
      });

      alert("Password changed 🔥");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Wrong old password ❌");
    }
  };

  // --- Ultra Tech Dashboard Animations ---
  const techStyles = `
    @keyframes lineFlow {
      0% { width: 0%; left: 50%; }
      100% { width: 100%; left: 0%; }
    }
    @keyframes bgMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .input-container {
      position: relative;
      margin-bottom: 35px;
      width: 100%;
    }
    .tech-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.03) !important;
      border: none !important;
      border-bottom: 1px solid rgba(0, 210, 255, 0.2) !important;
      padding: 15px 10px !important;
      color: #00d2ff !important;
      font-size: 16px !important;
      letter-spacing: 2px !important;
      outline: none !important;
      transition: all 0.4s ease;
      box-sizing: border-box;
    }
    .tech-input:focus {
      background: rgba(0, 210, 255, 0.05) !important;
      letter-spacing: 4px !important;
    }
    .focus-line {
      position: absolute;
      bottom: 0;
      height: 2px;
      background: #00d2ff;
      width: 0;
      left: 50%;
      transition: all 0.4s ease;
      box-shadow: 0 0 15px #00d2ff;
    }
    .tech-input:focus + .focus-line {
      width: 100%;
      left: 0;
    }
    .action-btn {
      background: transparent;
      border: 1px solid #00d2ff;
      color: #00d2ff;
      padding: 15px;
      width: 100%;
      font-weight: 900;
      letter-spacing: 3px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: 0.5s;
      border-radius: 4px;
    }
    .action-btn:hover {
      background: #00d2ff;
      color: #000;
      box-shadow: 0 0 30px rgba(0, 210, 255, 0.6);
    }
  `;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000",
      backgroundImage: `radial-gradient(circle at center, #0a0a1f 0%, #000 100%)`,
      fontFamily: "'Orbitron', sans-serif",
      overflow: "hidden",
      position: "relative"
    }}>
      <style>{techStyles}</style>

      <div style={{
        position: "absolute",
        width: "200%",
        height: "200%",
        backgroundImage: `linear-gradient(rgba(0, 210, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        transform: "rotateX(60deg) translateY(-200px)",
        opacity: 0.3,
        zIndex: 1
      }}></div>

      <div style={{
        background: "rgba(5, 5, 10, 0.8)",
        backdropFilter: "blur(20px)",
        padding: "50px",
        borderRadius: "2px",
        borderLeft: "4px solid #00d2ff",
        boxShadow: "0 0 50px rgba(0, 0, 0, 1)",
        width: "100%",
        maxWidth: "400px",
        zIndex: 10,
        position: "relative"
      }}>
        
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{
            color: "#fff",
            fontSize: "12px",
            letterSpacing: "5px",
            margin: "0 0 10px 0",
            opacity: 0.6
          }}>SECURITY TERMINAL</h2>
          <h1 style={{
            color: "#00d2ff",
            fontSize: "26px",
            margin: 0,
            fontWeight: "900",
            letterSpacing: "2px",
            textShadow: "0 0 10px rgba(0, 210, 255, 0.5)"
          }}>RESET_KEY</h1>
        </div>

        <div style={{ textAlign: "left" }}>
          
          <div className="input-container">
            <span style={{ color: "#444", fontSize: "10px", letterSpacing: "2px", fontWeight: "bold" }}>OLD_CREDENTIAL</span>
            <input
              type="password"
              placeholder="••••••••"
              className="tech-input"
              onChange={(e) => setOld(e.target.value)}
            />
            <div className="focus-line"></div>
          </div>

          <div className="input-container">
            <span style={{ color: "#444", fontSize: "10px", letterSpacing: "2px", fontWeight: "bold" }}>NEW_ENCRYPTION</span>
            <input
              type="password"
              placeholder="••••••••"
              className="tech-input"
              onChange={(e) => setNew(e.target.value)}
            />
            <div className="focus-line"></div>
          </div>

        </div>

        <button className="action-btn" onClick={handleSubmit}>
          AUTHORIZE CHANGE
        </button>

        <p 
          onClick={() => navigate(-1)}
          style={{
            marginTop: "30px",
            color: "#333",
            fontSize: "10px",
            textAlign: "center",
            cursor: "pointer",
            letterSpacing: "2px",
            transition: "0.3s"
          }}
          onMouseOver={(e) => e.target.style.color = "#00d2ff"}
          onMouseOut={(e) => e.target.style.color = "#333"}
        >
          // CANCEL_BACK_TO_GARAGE
        </p>
      </div>
    </div>
  );
}

export default ChangePassword;