import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function SellCar() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", brand: "", price: "", location: "",
    description: "", registration_number: "",
    whatsapp_number: "", fuel_type: "petrol",
  });

  const [images, setImages] = useState([null, null, null, null, null]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (index, file) => {
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalImages = images.filter(img => img !== null);
    if (finalImages.length === 0) { alert("Please upload at least 1 image ❌"); return; }
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      finalImages.forEach((img) => formData.append("images", img));
      await API.post("cars/sell/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Car submitted for approval ⏳");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Error ❌");
    }
  };

  // --- Styles ---
  const styles = {
    page: {
      minHeight: "100vh", width: "100vw", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#0f172a", overflow: "hidden",
      fontFamily: "'Inter', -apple-system, sans-serif", paddingBottom: "60px",
      boxSizing: "border-box", position: "relative",
    },
    bgGlow1: {
      position: "absolute", top: "-80px", left: "-80px",
      width: "300px", height: "300px", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)",
      pointerEvents: "none",
    },
    bgGlow2: {
      position: "absolute", bottom: "60px", right: "-60px",
      width: "240px", height: "240px", borderRadius: "50%",
      background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
      pointerEvents: "none",
    },
    card: {
      position: "relative", zIndex: 10, width: "560px",
      background: "rgba(255,255,255,0.97)", borderRadius: "20px",
      padding: "24px 32px 28px", animation: "fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
    },
    badge: {
      display: "inline-block", background: "#eef2ff", color: "#4f46e5",
      fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "100px",
      letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "6px",
      animation: "floatBadge 3s ease-in-out infinite",
    },
    sectionLabel: {
      fontSize: "10px", fontWeight: "800", color: "#94a3b8",
      textTransform: "uppercase", letterSpacing: "1px",
      margin: "14px 0 8px", display: "flex", alignItems: "center", gap: "8px",
    },
    input: {
      padding: "9px 12px", borderRadius: "10px", border: "1.5px solid #e2e8f0",
      fontSize: "13px", fontFamily: "inherit", outline: "none", color: "#0f172a",
      background: "#f8fafc", width: "100%", boxSizing: "border-box",
      transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    },
    label: {
      fontSize: "10px", fontWeight: "700", color: "#475569",
      textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block",
    },
    uploadBox: {
      width: "78px", height: "78px", border: "2px dashed #cbd5e1",
      borderRadius: "12px", display: "flex", alignItems: "center",
      justifyContent: "center", cursor: "pointer", overflow: "hidden",
      background: "#f8fafc", transition: "border-color 0.2s, background 0.2s, transform 0.2s",
      flexShrink: 0,
    },
    submitBtn: {
      marginTop: "16px", width: "100%", padding: "13px",
      background: "#0f172a", color: "#fff", border: "none",
      borderRadius: "12px", fontSize: "14px", fontWeight: "800",
      cursor: "pointer", letterSpacing: "0.3px", position: "relative",
      overflow: "hidden", transition: "background 0.25s, transform 0.15s",
      animation: "pulse 2.5s ease-in-out infinite",
    },
  };

  return (
    <>
      <style>{`
        @keyframes roadMove { from { background-position: 0px center; } to { background-position: -80px center; } }
        @keyframes drive { 0% { left: -80px; opacity: 0; } 5% { opacity: 1; } 95% { opacity: 1; } 100% { left: 105%; opacity: 0; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatBadge { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.3); } 50% { box-shadow: 0 0 0 6px rgba(99,102,241,0); } }
        .sc-input:focus { border-color: #6366f1 !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
        .sc-input::placeholder { color: #cbd5e1; }
        .sc-upload-box:hover { border-color: #6366f1 !important; background: #eef2ff !important; transform: scale(1.05); }
        .sc-submit:hover { background: #6366f1 !important; transform: translateY(-1px); }
        .sc-submit:active { transform: translateY(0) scale(0.99) !important; }
        .sc-submit::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); animation: shimmer 2.5s ease-in-out infinite; }
        .sc-section-label::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.bgGlow1} />
        <div style={styles.bgGlow2} />

        {/* Road & Car */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, width: "100%", height: "44px",
          background: "#1e293b",
          backgroundImage: "linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.12) 50%)",
          backgroundSize: "52px 6px", backgroundRepeat: "repeat-x",
          backgroundPosition: "0 center", animation: "roadMove 0.5s linear infinite", zIndex: 1,
        }} />
        <div style={{
          position: "absolute", bottom: "8px", fontSize: "30px", zIndex: 2,
          animation: "drive 7s linear infinite",
          filter: "drop-shadow(0 0 8px rgba(99,102,241,0.6))",
        }}>🏎️</div>

        {/* Card */}
        <div style={styles.card}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <div style={styles.badge}>List Your Vehicle</div>
            <h2 style={{ margin: "0 0 2px", fontSize: "22px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
              Sell Your Car
            </h2>
            <p style={{ color: "#64748b", fontSize: "12px", margin: 0 }}>Enter details and upload photos</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0" }}>

            {/* Basic Info */}
            <div className="sc-section-label" style={styles.sectionLabel}>Basic Info</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={styles.label}>Car Title</label>
                <input name="title" placeholder="e.g. Swift 2022" onChange={handleChange}
                  className="sc-input" style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>Brand</label>
                <input name="brand" placeholder="e.g. Maruti" onChange={handleChange}
                  className="sc-input" style={styles.input} required />
              </div>
            </div>

            {/* Pricing & Location */}
            <div className="sc-section-label" style={{ ...styles.sectionLabel }}>Pricing & Location</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div>
                <label style={styles.label}>Price (₹)</label>
                <input name="price" type="number" placeholder="0.00" onChange={handleChange}
                  className="sc-input" style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>Location</label>
                <input name="location" placeholder="City" onChange={handleChange}
                  className="sc-input" style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>Fuel Type</label>
                <select name="fuel_type" value={form.fuel_type} onChange={handleChange}
                  className="sc-input" style={{ ...styles.input, appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: "28px" }}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="cng">CNG</option>
                </select>
              </div>
            </div>

            {/* Contact & Registration */}
            <div className="sc-section-label" style={styles.sectionLabel}>Contact & Registration</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={styles.label}>WhatsApp Number</label>
                <input name="whatsapp_number" placeholder="+91 XXXXX XXXXX" onChange={handleChange}
                  className="sc-input" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Reg. Number</label>
                <input name="registration_number" placeholder="KL-XX-XXXX" onChange={handleChange}
                  className="sc-input" style={styles.input} required />
              </div>
            </div>

            {/* Description */}
            <div className="sc-section-label" style={styles.sectionLabel}>Description</div>
            <textarea name="description" placeholder="Describe your car — condition, mileage, features..."
              onChange={handleChange} className="sc-input"
              style={{ ...styles.input, height: "66px", resize: "none" }} required />

            {/* Photos */}
            <div className="sc-section-label" style={styles.sectionLabel}>
              Photos
              <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#cbd5e1", fontSize: "10px" }}>(up to 5)</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {images.map((img, index) => (
                <label key={index} className="sc-upload-box" style={styles.uploadBox}>
                  {img ? (
                    <img src={URL.createObjectURL(img)} alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "22px", color: "#cbd5e1", lineHeight: 1 }}>+</span>
                  )}
                  <input type="file" hidden accept="image/*"
                    onChange={(e) => handleFileChange(index, e.target.files[0])} />
                </label>
              ))}
            </div>

            {/* Submit */}
            <button type="submit" className="sc-submit" style={styles.submitBtn}>
              Submit Listing 🚀
            </button>
            <button type="button" onClick={() => navigate("/")}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
                fontSize: "12px", fontWeight: "600", textDecoration: "underline", marginTop: "8px" }}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SellCar;