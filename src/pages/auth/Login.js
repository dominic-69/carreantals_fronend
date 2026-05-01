"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";

export default function Login() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  /* ── Auth guard ── */
  useEffect(() => {
    const token = localStorage.getItem("access");
    try {
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        const user = JSON.parse(userStr);
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "seller") navigate("/seller");
        else navigate("/");
      }
    } catch (e) {
      localStorage.removeItem("user");
    }
  }, [navigate]);

  /* ── Canvas Background ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2,
      o: Math.random(),
      s: Math.random() * 0.01,
    }));
    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#020408";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${Math.abs(Math.sin(s.o))})`;
        ctx.fill();
        s.o += s.s;
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("auth/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.role === "admin" ? "/admin" : (res.data.user.role === "seller" ? "/seller" : "/"));
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const res = await API.post("auth/google-login/", {
        email: result.user.email,
        username: result.user.displayName,
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      alert("Google login failed ❌");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Exo+2:wght@300;400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .root { min-height: 100vh; background: #020408; font-family: 'Exo 2', sans-serif; overflow: hidden; position: relative; }
        
        .bg-canvas { position: absolute; inset: 0; z-index: 1; }

        .panel { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; z-index: 10; padding: 20px; }

        .glass-card { 
          width: 100%; max-width: 420px; background: rgba(13, 17, 28, 0.96); border: 1px solid rgba(0, 210, 255, 0.2); border-radius: 30px; padding: 50px; 
          box-shadow: 0 40px 100px rgba(0,0,0,0.9); 
          transition: border-color 0.3s ease;
        }

        .brand h1 { font-family: 'Rajdhani', sans-serif; font-size: 32px; color: #fff; text-align: center; margin-bottom: 5px; letter-spacing: 4px; font-weight: 700; }
        .brand span { color: #00d2ff; text-shadow: 0 0 10px #00d2ff; }
        
        .field-group { margin-bottom: 20px; }
        .field-label { display: block; font-size: 11px; color: #00d2ff; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 2px; font-weight: 600; opacity: 0.7; }
        
        input { width: 100%; padding: 15px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 210, 255, 0.1); border-radius: 12px; color: #fff; outline: none; transition: 0.3s; }
        input:focus { border-color: #00d2ff; background: rgba(0, 210, 255, 0.05); }

        .forgot-pass { 
          display: block; text-align: right; font-size: 12px; color: rgba(0, 210, 255, 0.6); 
          text-decoration: none; margin-top: -10px; margin-bottom: 20px; cursor: pointer; transition: 0.3s;
        }
        .forgot-pass:hover { color: #fff; text-shadow: 0 0 8px #00d2ff; }

        .btn-signin { width: 100%; padding: 18px; background: linear-gradient(90deg, #00d2ff, #3a47ff); border: none; border-radius: 12px; color: #fff; font-family: 'Rajdhani'; font-size: 20px; font-weight: 700; cursor: pointer; letter-spacing: 4px; transition: 0.4s; }
        .btn-signin:hover { letter-spacing: 6px; box-shadow: 0 10px 30px rgba(0, 210, 255, 0.4); }

        .btn-google { 
          width: 100%; padding: 14px; background: #fff; border: none; border-radius: 12px; color: #000; 
          display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 25px; 
          cursor: pointer; font-weight: 600; font-size: 14px; transition: 0.3s; 
        }
        .btn-google:hover { background: #f0f0f0; }

        .reg-link { text-align: center; margin-top: 30px; font-size: 14px; color: rgba(255,255,255,0.4); }
        .reg-link span { color: #00d2ff; cursor: pointer; font-weight: 700; transition: 0.3s; }
        .reg-link span:hover { text-shadow: 0 0 10px #00d2ff; }
      `}</style>

      <div className="root">
        <canvas ref={canvasRef} className="bg-canvas" />

        <div className="panel">
          <div className="glass-card">
            <div className="brand">
              <h1>Porsche <span>Access</span></h1>
              <p style={{ color: "rgba(255,255,255,0.2)", textAlign: "center", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "35px" }}>Identification Required</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Unit ID</label>
                <input name="username" placeholder="USERNAME" onChange={handleChange} required autoComplete="off" />
              </div>
              
              <div className="field-group">
                <label className="field-label">Access Code</label>
                <input name="password" type="password" placeholder="PASSWORD" onChange={handleChange} required />
              </div>

              <a className="forgot-pass" onClick={() => navigate("/forgot-password")}>
                Reset Access Protocol?
              </a>

              <button className="btn-signin" type="submit" disabled={loading}>
                {loading ? "AUTHENTICATING..." : "START SYSTEM"}
              </button>
            </form>

            <button className="btn-google" type="button" onClick={handleGoogleLogin}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Authentication
            </button>

            <p className="reg-link">
              No profile found? <span onClick={() => navigate("/register")}>Register Unit</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}