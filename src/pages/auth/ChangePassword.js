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
      // 🔥 CORRECT ENDPOINT (NO CHANGE)
      await API.post("auth/change-password/", {
        old_password,
        new_password,
      });

      alert("Password changed 🔥");

      // 🔥 FORCE LOGOUT AFTER CHANGE
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      navigate("/login");
    } catch (err) {
      console.log(err);

      // 🔥 BETTER ERROR HANDLING
      if (err.response?.status === 401) {
        alert("Session expired ❌ Please login again");
        localStorage.clear();
        navigate("/login");
      } else {
        alert(err.response?.data?.error || "Wrong old password ❌");
      }
    }
  };

  // --- Ultra Tech Dashboard Animations ---
  const techStyles = `
    @keyframes lineFlow {
      0% { width: 0%; left: 50%; }
      100% { width: 100%; left: 0%; }
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
        background: "rgba(5, 5, 10, 0.8)",
        backdropFilter: "blur(20px)",
        padding: "50px",
        borderLeft: "4px solid #00d2ff",
        width: "100%",
        maxWidth: "400px"
      }}>
        
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ color: "#fff", fontSize: "12px", opacity: 0.6 }}>
            SECURITY TERMINAL
          </h2>
          <h1 style={{ color: "#00d2ff" }}>RESET_KEY</h1>
        </div>

        <div>
          <div className="input-container">
            <span style={{ color: "#444", fontSize: "10px" }}>OLD_CREDENTIAL</span>
            <input
              type="password"
              className="tech-input"
              onChange={(e) => setOld(e.target.value)}
            />
            <div className="focus-line"></div>
          </div>

          <div className="input-container">
            <span style={{ color: "#444", fontSize: "10px" }}>NEW_ENCRYPTION</span>
            <input
              type="password"
              className="tech-input"
              onChange={(e) => setNew(e.target.value)}
            />
            <div className="focus-line"></div>
          </div>
        </div>

        <button className="action-btn" onClick={handleSubmit}>
          AUTHORIZE CHANGE
        </button>

        <p onClick={() => navigate(-1)} style={{ marginTop: "30px", cursor: "pointer" }}>
          // CANCEL_BACK_TO_GARAGE
        </p>
      </div>
    </div>
  );
}

export default ChangePassword;