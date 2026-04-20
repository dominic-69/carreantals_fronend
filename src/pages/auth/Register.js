import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // eslint-disable-next-line no-unused-vars
    const res = await API.post("auth/register/", form); // ✅ FIX

    alert("Registration successful ✅");

    navigate("/login");

  } catch (err) {
    console.log(err.response?.data);

    alert(
      err.response?.data?.detail ||
      err.response?.data?.email ||
      "Registration failed ❌"
    );
  }
};

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await API.post("google-login/", { 
        email: user.email,
        username: user.displayName,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      navigate("/");
    } catch (err) {
      alert("Google signup failed ❌");
    }
  };

  // --- Theme Styles ---
  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    background: "rgba(0, 0, 0, 0.6)",
    border: "1px solid rgba(0, 210, 255, 0.4)",
    borderRadius: "12px",
    color: "#ffffff",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: "rgba(10, 10, 15, 0.85)",
        backdropFilter: "blur(20px)",
        padding: "40px",
        borderRadius: "30px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
        width: "100%",
        maxWidth: "400px",
      }}>
        
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#ffffff",
            margin: "0",
            letterSpacing: "-1px"
          }}>
            Join the <span style={{ color: "#00d2ff" }}>Drive</span>
          </h2>
          <p style={{ color: "#8b949e", fontSize: "14px", marginTop: "8px" }}>
            Premium Car Rentals & Sales
          </p>
        </div>

        {/* 🔐 Normal Register Form */}
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "10px",
              background: loading ? "#2c2c3d" : "linear-gradient(135deg, #00d2ff 0%, #3a47ff 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 10px 20px rgba(0, 210, 255, 0.3)",
            }}
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* 🔥 Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          margin: "25px 0",
          color: "#444"
        }}>
          <div style={{ flex: 1, height: "1px", background: "#333" }}></div>
          <span style={{ padding: "0 15px", fontSize: "11px", color: "#888", fontWeight: "bold" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "#333" }}></div>
        </div>

        {/* 🔥 Google Button */}
        <button
          onClick={handleGoogleRegister}
          style={{
            width: "100%",
            padding: "12px",
            background: "#ffffff",
            color: "#000000",
            border: "none",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/icon_google.svg" 
            alt="google" 
            style={{ width: "18px" }} 
          />
          Google Signup
        </button>

        <p style={{
          textAlign: "center",
          marginTop: "30px",
          fontSize: "14px",
          color: "#8b949e"
        }}>
          Already a member?{" "}
          <span
            style={{
              color: "#00d2ff",
              cursor: "pointer",
              fontWeight: "bold",
              borderBottom: "1px solid #00d2ff"
            }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;