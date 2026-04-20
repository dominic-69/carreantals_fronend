import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function KYC() {
  const [license, setLicense] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 Upload to Cloudinary
  // eslint-disable-next-line no-unused-vars
  const uploadToCloudinary = async (file) => {
  const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // ⚠️ change this

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      formData
    );

    return res.data.secure_url;
  };

const handleSubmit = async () => {
  if (!license || !selfie) {
    alert("Please upload both documents.");
    return;
  }

  setLoading(true);
  const token = localStorage.getItem("access");

  const formData = new FormData();
  formData.append("full_name", "User");
  formData.append("license_number", "TEMP123");

  // ✅ SEND FILES (IMPORTANT)
  formData.append("license_image", license);
  formData.append("selfie_image", selfie);

  try {
    await axios.post("http://127.0.0.1:8000/api/kyc/submit/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ REMOVE THIS LINE (IMPORTANT)
        // "Content-Type": "multipart/form-data",
      },
    });

    alert("KYC Submitted Successfully ✅");
    navigate("/profile");
  } catch (err) {
    console.error(err.response?.data);
    alert("KYC Submission Failed ❌");
  } finally {
    setLoading(false);
  }
};

  // --- Styles (UNCHANGED) ---
  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
    padding: "20px"
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "450px",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e2e8f0"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "30px"
  };

  const sectionStyle = {
    marginBottom: "20px"
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "8px"
  };

  const fileInputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "#f1f5f9",
    cursor: "pointer"
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    backgroundColor: loading ? "#94a3b8" : "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "10px",
    transition: "background 0.2s"
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        
        <div style={headerStyle}>
          <h2 style={{ margin: "0", color: "#1e293b" }}>Identity Verification</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>
            Please provide your documents to verify your identity.
          </p>
        </div>

        <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", marginBottom: "25px" }} />

        <div style={sectionStyle}>
          <label style={labelStyle}>1. Driving License (Front View)</label>
          <input 
            type="file" 
            style={fileInputStyle} 
            onChange={(e) => setLicense(e.target.files[0])} 
          />
          {license && <small style={{color: "#16a34a"}}>✓ {license.name}</small>}
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>2. Your Selfie (Clearly Visible)</label>
          <input 
            type="file" 
            style={fileInputStyle} 
            onChange={(e) => setSelfie(e.target.files[0])} 
          />
          {selfie && <small style={{color: "#16a34a"}}>✓ {selfie.name}</small>}
        </div>

        <div style={{ backgroundColor: "#eff6ff", padding: "12px", borderRadius: "6px", marginBottom: "25px" }}>
          <p style={{ fontSize: "12px", color: "#1e40af", margin: "0" }}>
            🔒 Your documents are handled securely.
          </p>
        </div>

        <button onClick={handleSubmit} style={buttonStyle} disabled={loading}>
          {loading ? "Processing..." : "Submit Verification"}
        </button>

      </div>
    </div>
  );
}

export default KYC;