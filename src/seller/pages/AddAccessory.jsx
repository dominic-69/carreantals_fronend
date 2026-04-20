import React, { useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { addAccessory } from "../../services/api";

const AddAccessory = () => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
    category: "",
  });

  const [images, setImages] = useState([null, null, null, null, null]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((img) => {
      if (img) formData.append("images", img);
    });

    try {
      await addAccessory(formData);
      alert("Accessory added ✅");
    } catch (err) {
      alert("Error ❌");
    }
  };

  // --- Common Inline Styles ---
  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    transition: "border 0.2s",
    background: "#f8fafc"
  };

  return (
    <div style={{ display: "flex", background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <SellerSidebar />

      <div style={{ flex: 1, padding: "40px", display: "flex", justifyContent: "center" }}>
        <div style={{ 
          width: "100%", 
          maxWidth: "700px", 
          background: "#fff", 
          borderRadius: "20px", 
          padding: "40px", 
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          height: "fit-content"
        }}>
          
          <div style={{ borderBottom: "1px solid #f1f5f9", marginBottom: "30px", paddingBottom: "10px" }}>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#0f172a", fontWeight: "800" }}>Add New Accessory</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>Fill in the details to list your product</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* 📸 IMAGE UPLOAD GRID */}
            <div style={{ marginBottom: "25px" }}>
              <span style={labelStyle}>Product Images (Up to 5)</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
                {images.map((img, index) => (
                  <label 
                    key={index} 
                    style={{
                      height: "100px",
                      background: "#f8fafc",
                      border: "2px dashed #cbd5e1",
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = "#6366f1"}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = "#cbd5e1"}
                  >
                    {img ? (
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ textAlign: "center", color: "#94a3b8" }}>
                        <span style={{ fontSize: "20px", display: "block" }}>+</span>
                        <span style={{ fontSize: "10px", fontWeight: "600" }}>Upload</span>
                      </div>
                    )}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleImageChange(index, e.target.files[0])}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* FORM FIELDS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input name="name" placeholder="e.g. Leather Seat Cover" onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Brand</label>
                <input name="brand" placeholder="e.g. Sparco" onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Price (₹)</label>
                <input name="price" type="number" placeholder="0.00" onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Stock Quantity</label>
                <input name="stock" type="number" placeholder="Available units" onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <label style={labelStyle}>Category</label>
            <select name="category" onChange={handleChange} style={inputStyle}>
              <option value="">Choose a category</option>
              <option value="interior">Interior</option>
              <option value="exterior">Exterior</option>
              <option value="electronics">Electronics</option>
              <option value="safety">Safety</option>
            </select>

            <label style={labelStyle}>Description</label>
            <textarea 
              name="description" 
              placeholder="Tell customers about your product..." 
              onChange={handleChange} 
              style={{ ...inputStyle, height: "120px", resize: "none" }} 
            />

            <button 
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                transition: "opacity 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              Add Accessory
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAccessory;