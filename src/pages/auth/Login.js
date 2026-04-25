"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const ringPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [globalTilt, setGlobalTilt] = useState({ x: 0, y: 0, scale: 1 });

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

  /* ── Custom Cursor & Power Tilt ── */
  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const tiltX = (e.clientY - centerY) / 20; 
      const tiltY = (centerX - e.clientX) / 20; 
      setGlobalTilt({ x: tiltX, y: tiltY, scale: 1.05 });
    };

    const onLeave = () => setGlobalTilt({ x: 0, y: 0, scale: 1 });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    let rafId;
    const lerpRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;
      ring.style.left = ringPos.current.x + "px";
      ring.style.top = ringPos.current.y + "px";
      rafId = requestAnimationFrame(lerpRing);
    };
    lerpRing();

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

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
        .root { min-height: 100vh; background: #020408; font-family: 'Exo 2', sans-serif; overflow: hidden; cursor: none; position: relative; }
        .cursor-dot { position: fixed; width: 10px; height: 10px; background: #00d2ff; border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); mix-blend-mode: screen; }
        .cursor-ring { position: fixed; width: 40px; height: 40px; border: 1.5px solid rgba(0,210,255,.5); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%, -50%); }

        .speed-line { position: absolute; height: 1px; background: linear-gradient(90deg, transparent, rgba(0, 210, 255, 0.2), transparent); pointer-events: none; }

        .panel { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 10; }

        .glass-card { 
          width: 100%; max-width: 420px; background: rgba(13, 17, 28, 0.96); border: 1px solid rgba(0, 210, 255, 0.2); border-radius: 30px; padding: 50px; 
          box-shadow: 0 40px 100px rgba(0,0,0,0.9); 
          position: relative; 
          animation: cornerCircuit 2.5s cubic-bezier(0.19, 1, 0.22, 1) both;
          transition: transform 0.15s ease-out;
          transform-style: preserve-3d;
        }

        @keyframes cornerCircuit {
          0% { transform: translate(-45vw, 45vh) scale(0.1) rotateZ(-45deg); opacity: 0; }
          25% { transform: translate(-45vw, -45vh) scale(0.4) rotateZ(0deg); opacity: 0.3; }
          50% { transform: translate(45vw, -45vh) scale(0.6) rotateY(180deg); opacity: 0.6; }
          75% { transform: translate(45vw, 45vh) scale(0.8) rotateY(270deg); opacity: 0.8; }
          100% { transform: translate(0, 0) scale(1) rotateY(360deg); opacity: 1; }
        }

        .brand h1 { font-family: 'Rajdhani', sans-serif; font-size: 32px; color: #fff; text-align: center; margin-bottom: 5px; letter-spacing: 4px; font-weight: 700; }
        .brand span { color: #00d2ff; text-shadow: 0 0 10px #00d2ff; }
        
        .field-group { margin-bottom: 20px; }
        .field-label { display: block; font-size: 11px; color: #00d2ff; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 2px; font-weight: 600; opacity: 0.7; }
        
        input { width: 100%; padding: 15px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 210, 255, 0.1); border-radius: 12px; color: #fff; outline: none; cursor: none; transition: 0.3s; }
        input:focus { border-color: #00d2ff; background: rgba(0, 210, 255, 0.05); }

        /* Forgot Password Link Styling */
        .forgot-pass { 
          display: block; text-align: right; font-size: 12px; color: rgba(0, 210, 255, 0.6); 
          text-decoration: none; margin-top: -10px; margin-bottom: 20px; cursor: none; transition: 0.3s;
        }
        .forgot-pass:hover { color: #fff; text-shadow: 0 0 8px #00d2ff; }

        .btn-signin { width: 100%; padding: 18px; background: linear-gradient(90deg, #00d2ff, #3a47ff); border: none; border-radius: 12px; color: #fff; font-family: 'Rajdhani'; font-size: 20px; font-weight: 700; cursor: none; letter-spacing: 4px; transition: 0.4s; }
        .btn-signin:hover { letter-spacing: 6px; box-shadow: 0 10px 30px rgba(0, 210, 255, 0.4); }

        .btn-google { 
          width: 100%; padding: 14px; background: #fff; border: none; border-radius: 12px; color: #000; 
          display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 25px; 
          cursor: none; font-weight: 600; font-size: 14px; transition: 0.3s; 
        }
        .btn-google:hover { background: #f0f0f0; }

        .reg-link { text-align: center; margin-top: 30px; font-size: 14px; color: rgba(255,255,255,0.4); }
        .reg-link span { color: #00d2ff; cursor: none; font-weight: 700; transition: 0.3s; }
        .reg-link span:hover { text-shadow: 0 0 10px #00d2ff; }
      `}</style>

      <div className="root">
        <div ref={cursorRef} className="cursor-dot" />
        <div ref={ringRef} className="cursor-ring" />
        <canvas ref={canvasRef} className="bg-canvas" />

        {/* ── Motion Car Background ── */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="speed-line"
              style={{ top: `${10 + i * 12}%`, width: `${200 + Math.random() * 300}px`, left: "-500px" }}
              animate={{ x: ["0vw", "150vw"] }}
              transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, ease: "linear" }}
            />
          ))}

          <motion.div
            animate={{ x: ["-100vw", "150vw"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", bottom: "15%", opacity: 0.03 }}
          >
            <svg width="600" height="200" viewBox="0 0 600 200" fill="#00d2ff">
              <path d="M50 150 L50 120 L100 80 L200 60 L450 60 L550 100 L580 150 Z" />
            </svg>
          </motion.div>
        </div>

        <div className="panel">
          <div 
            className="glass-card" 
            ref={cardRef}
            style={{
              transform: `perspective(1200px) rotateX(${globalTilt.x}deg) rotateY(${globalTilt.y}deg) scale(${globalTilt.scale})`
            }}
          >
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

              {/* ✅ Forgot Password Option Added */}
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