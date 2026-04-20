import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

// Firebase
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ FIXED SAFE LOGIN CHECK
  useEffect(() => {
    const token = localStorage.getItem("access");

    let user = null;

    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        user = JSON.parse(storedUser);
      } else {
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.log("Invalid user in localStorage");
      localStorage.removeItem("user");
    }

    if (token && user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "seller") navigate("/seller");
      else navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔐 LOGIN (✅ FIXED URL)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("auth/login/", form); // ✅ FIX

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "admin") navigate("/admin");
      else if (role === "seller") navigate("/seller");
      else navigate("/");

    } catch (err) {
      console.log(err.response?.data);

      alert(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors ||
        "Invalid credentials ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GOOGLE LOGIN (✅ FIXED URL)
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await API.post("auth/google-login/", { // ✅ FIX
        email: user.email,
        username: user.displayName,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "admin") navigate("/admin");
      else if (role === "seller") navigate("/seller");
      else navigate("/");

    } catch (err) {
      console.log(err);
      alert("Google login failed ❌");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "20px",
    background: "rgba(0, 0, 0, 0.6)",
    border: "1px solid rgba(0, 210, 255, 0.3)",
    borderRadius: "12px",
    color: "#ffffff",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          background: "rgba(10, 10, 15, 0.85)",
          backdropFilter: "blur(20px)",
          padding: "40px",
          borderRadius: "30px",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#fff" }}>
          Rev Your <span style={{ color: "#00d2ff" }}>Engine</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
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

          <div
            style={{ textAlign: "right", color: "#00d2ff", cursor: "pointer" }}
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #00d2ff, #3a47ff)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            {loading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: "#fff",
            borderRadius: "12px",
          }}
        >
          Login with Google
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#aaa" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#00d2ff", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;