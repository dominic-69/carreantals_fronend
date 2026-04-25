"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// ✅ React Toastify Imports
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const cardRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    // Block scroll on this page
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/auth/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setForm(res.data);
    } catch (err) {
      toast.error("Failed to fetch profile 🛰️");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    setTimeout(() => navigate("/login"), 1000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
    toast.success("Image selected 📸");
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("username", form.username || "");
    formData.append("phone", form.phone || "");
    formData.append("address", form.address || "");
    if (image) formData.append("profile_image", image);

    try {
      await axios.put("http://127.0.0.1:8000/api/auth/profile/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // ✅ Toast Notification
      toast.success("Profile Updated Successfully! ✨", {
        position: "top-right",
        autoClose: 3000,
      });
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      toast.error("Update failed! Please check connection. ❌");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&family=Inter:wght@400;600&display=swap');
        
        .profile-root {
          height: 100vh; width: 100vw;
          background: #0a0510; 
          font-family: 'Inter', sans-serif;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }

        /* ── Advanced Animated Background ── */
        .bg-gradient-mesh {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(217, 70, 239, 0.15) 0%, transparent 50%);
          z-index: 0;
        }

        .tech-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 1;
        }

        .glass-card {
          width: 440px; background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(232, 121, 249, 0.3); border-radius: 40px;
          padding: 40px; box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
          position: relative; z-index: 10; text-align: center;
          animation: expandAndRound 1.8s cubic-bezier(0.19, 1, 0.22, 1) both;
        }

        @keyframes expandAndRound {
          0% { height: 2px; width: 0%; opacity: 0; transform: scaleX(0); }
          40% { height: 2px; width: 440px; opacity: 1; transform: scaleX(1); }
          70% { height: 100vh; width: 440px; }
          100% { height: auto; width: 440px; border-radius: 45px; min-height: 620px; }
        }

        /* ── Edit Card Spin ── */
        .edit-card-active {
          animation: spinIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          background: #fffafa; border: 1px solid #fecdd3; padding: 25px; border-radius: 35px;
        }
        @keyframes spinIn {
          from { transform: rotate(-180deg) scale(0.5); opacity: 0; }
          to { transform: rotate(0deg) scale(1); opacity: 1; }
        }

        .profile-title { font-family: 'Rajdhani'; font-size: 38px; color: #701a75; text-transform: uppercase; margin: 10px 0; letter-spacing: 2px; }
        
        .kyc-box {
          background: #fdf4ff; border: 1.5px dashed #d946ef; padding: 15px; border-radius: 20px;
          cursor: pointer; transition: 0.3s; margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .kyc-box:hover { background: #fae8ff; border-style: solid; transform: translateY(-3px); }

        .btn-main {
          width: 100%; padding: 16px; border: none; border-radius: 16px; color: #fff;
          font-weight: 700; cursor: pointer; transition: 0.4s; margin-top: 10px;
          background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
        }
        .btn-main:hover { box-shadow: 0 12px 25px rgba(168, 85, 247, 0.4); transform: translateY(-2px); }

        .back-home {
          position: absolute; top: 30px; left: 30px; background: rgba(255,255,255,0.1); border: 1px solid #d946ef;
          padding: 10px 20px; border-radius: 25px; color: #fff; font-weight: 600; font-size: 12px;
          cursor: pointer; z-index: 100; backdrop-filter: blur(5px);
        }
        .back-home:hover { background: #d946ef; }

        input {
          width: 100%; padding: 14px; margin: 10px 0; border: 1px solid #fbcfe8;
          border-radius: 12px; outline: none; background: #fff; transition: 0.3s;
        }
        input:focus { border-color: #d946ef; box-shadow: 0 0 10px rgba(217, 70, 239, 0.1); }
      `}</style>

      <div className="profile-root">
        {/* ✅ Toast Notifications Container */}
        <ToastContainer theme="colored" />

        <button className="back-home" onClick={() => navigate("/")}>← BACK TO HOME</button>
        
        <div className="bg-gradient-mesh" />
        <div className="tech-grid" />
        
        {/* Animated Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.3, 0] }}
            transition={{ duration: Math.random() * 8 + 4, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            style={{ position: "absolute", color: "#d946ef", fontSize: "14px", fontFamily: "monospace", zIndex: 2 }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </motion.div>
        ))}

        <div className="glass-card">
          {user ? (
            <>
              {/* DP */}
              <div style={{ width: 120, height: 120, borderRadius: "50%", border: "4px solid #fff", margin: "0 auto 15px", overflow: 'hidden', boxShadow: '0 10px 30px rgba(217, 70, 239, 0.3)' }}>
                {user.profile_image ? (
                  <img src={`http://127.0.0.1:8000${user.profile_image}`} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5d0fe', color: '#701a75', fontSize: '36px', fontWeight: 'bold' }}>
                    {user.username?.[0].toUpperCase()}
                  </div>
                )}
              </div>

              {!editMode ? (
                <>
                  <h1 className="profile-title">{user.username}</h1>
                  <p style={{ color: "#701a75", fontSize: "15px", marginBottom: "25px", fontWeight: "600", opacity: 0.6 }}>{user.email}</p>
                  
                  <div style={{ textAlign: "left", marginBottom: "20px", fontSize: "15px", color: "#4a044e" }}>
                    <p style={{ margin: "10px 0" }}><strong>📞 Phone:</strong> {user.phone || "Not set"}</p>
                    <p style={{ margin: "10px 0" }}><strong>📍 Address:</strong> {user.address || "Not set"}</p>
                  </div>

                  {/* KYC Box */}
                  <div className="kyc-box" onClick={() => navigate("/kyc")}>
                    <span style={{ fontWeight: "700", color: "#701a75" }}>KYC PROTOCOL:</span>
                    <span style={{ color: user.kyc_status === 'approved' ? '#16a34a' : '#ea580c', fontWeight: '800' }}>
                      {user.kyc_status === 'approved' ? "ACTIVE ✅" : "PENDING ⏳"}
                    </span>
                  </div>

                  <button onClick={() => { setEditMode(true); toast.info("Entering Edit Mode ✏️"); }} className="btn-main">Edit Profile</button>
                  <button onClick={() => navigate("/change-password")} className="btn-main" style={{ background: "#fff", color: "#a21caf", border: "1.5px solid #f0abfc" }}>Security Settings</button>
                  <button onClick={handleLogout} style={{ border: 'none', background: 'none', color: '#be185d', marginTop: 25, cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>TERMINATE SESSION</button>
                </>
              ) : (
                <div className="edit-card-active">
                  <h2 style={{ fontSize: "20px", color: "#be185d", marginBottom: "15px", fontFamily: 'Rajdhani' }}>MODIFY IDENTITY</h2>
                  <input name="username" value={form.username || ""} onChange={handleChange} placeholder="Unit Name" />
                  <input name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Comms Line" />
                  <input name="address" value={form.address || ""} onChange={handleChange} placeholder="Base Location" />
                  <input type="file" onChange={handleImage} style={{ border: 'none', padding: '0', fontSize: '12px' }} />
                  
                  <button onClick={handleUpdate} className="btn-main" style={{ background: '#059669' }}>SYNC CHANGES</button>
                  <button onClick={() => { setEditMode(false); toast.warn("Changes Discarded"); }} className="btn-main" style={{ background: "#fff", color: "#444", border: "1px solid #ddd" }}>ABORT</button>
                </div>
              )}
            </>
          ) : (
            <div style={{ color: "#d946ef", fontWeight: "bold", letterSpacing: "2px" }}>LINKING TO DATA STREAM...</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;