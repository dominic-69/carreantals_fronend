import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/auth/profile/", { // ✅ Corrected Path
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
      setForm(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err.response?.data);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("access");
    const formData = new FormData();

    // ✅ Appending only updated fields
    formData.append("username", form.username || "");
    formData.append("phone", form.phone || "");
    formData.append("address", form.address || "");

    if (image) {
      formData.append("profile_image", image);
    }

    try {
      await axios.put("http://127.0.0.1:8000/api/auth/profile/", formData, { // ✅ Corrected Path
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated ✅");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error(err.response?.data);
      alert("Update failed ❌");
    }
  };

  // --- 🎨 MERGED OLD UI STYLES ---
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f7f6",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px"
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    border: "1px solid #eaeaea"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  };

  const primaryBtn = {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    backgroundColor: "#2563eb",
    color: "#fff",
  };

  const secondaryBtn = {
    ...primaryBtn,
    backgroundColor: "#f8fafc",
    color: "#475569",
    border: "1px solid #e2e8f0",
    marginTop: "10px"
  };

  const logoutBtn = {
    ...secondaryBtn,
    color: "#dc2626",
    border: "none",
    background: "none"
  };

  const avatarContainer = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px auto",
    overflow: "hidden",
    border: "3px solid #fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {user ? (
          <>
            <div style={avatarContainer}>
              {user.profile_image ? (
                <img
                  src={`http://127.0.0.1:8000${user.profile_image}`}
                  alt="profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "36px", fontWeight: "bold", color: "#64748b" }}>
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {!editMode ? (
              <>
                <h2 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>{user.username}</h2>
                <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "14px" }}>{user.email}</p>
                
                <div style={{ textAlign: "left", marginBottom: "20px", fontSize: "14px", color: "#475569" }}>
                  <p style={{ margin: "8px 0" }}><strong>📞 Phone:</strong> {user.phone || "Not set"}</p>
                  <p style={{ margin: "8px 0" }}><strong>📍 Address:</strong> {user.address || "Not set"}</p>
                </div>

                <button onClick={() => setEditMode(true)} style={primaryBtn}>
                  Edit Profile
                </button>
              </>
            ) : (
              <div style={{ textAlign: "left" }}>
                <label style={{ fontSize: "12px", color: "#64748b", marginLeft: "4px" }}>Username</label>
                <input name="username" value={form.username || ""} onChange={handleChange} style={inputStyle} />
                
                <label style={{ fontSize: "12px", color: "#64748b", marginLeft: "4px", display: "block", marginTop: "10px" }}>Phone</label>
                <input name="phone" value={form.phone || ""} onChange={handleChange} style={inputStyle} />
                
                <label style={{ fontSize: "12px", color: "#64748b", marginLeft: "4px", display: "block", marginTop: "10px" }}>Address</label>
                <input name="address" value={form.address || ""} onChange={handleChange} style={inputStyle} />
                
                <label style={{ fontSize: "12px", color: "#64748b", marginLeft: "4px", display: "block", marginTop: "10px" }}>Profile Picture</label>
                <input type="file" onChange={handleImage} style={{ ...inputStyle, border: "none" }} />

                <button onClick={handleUpdate} style={{ ...primaryBtn, backgroundColor: "#16a34a" }}>
                  Save Changes
                </button>
                <button onClick={() => setEditMode(false)} style={secondaryBtn}>
                  Cancel
                </button>
              </div>
            )}

            <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", margin: "25px 0" }} />

            {/* KYC Section */}
            <div style={{ marginBottom: "10px", fontSize: "14px" }}>
              <strong>KYC Status:</strong>{" "}
              <span style={{
                color: user.kyc_status === "approved" ? "green" : user.kyc_status === "pending" ? "#f59e0b" : "red",
                fontWeight: "600"
              }}>
                {user.kyc_status === "approved" ? "✅ Approved" : user.kyc_status === "pending" ? "⏳ Pending" : "❌ Rejected/Not Submitted"}
              </span>
            </div>

            <button onClick={() => navigate("/kyc")} style={primaryBtn}>
              {user.kyc_status === "approved" ? "KYC Completed ✅" : "Verify KYC"}
            </button>

            <button onClick={() => navigate("/change-password")} style={secondaryBtn}>
              Change Password
            </button>

            <button onClick={handleLogout} style={logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <p style={{ color: "#64748b" }}>Loading Profile...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;