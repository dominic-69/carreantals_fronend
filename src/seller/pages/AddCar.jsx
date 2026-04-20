/* eslint-disable no-undef */
import React, { useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import API, { addCar } from "../../services/api"; 

const AddCar = () => {
  const [form, setForm] = useState({
    title: "",
    brand: "",
    price: "",
    location: "",
    description: "",
    registration_number: "",
    fuel_type: "", 
    seats: "",    
  });

  const [images, setImages] = useState(Array(5).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔥 AI PRICE STATES
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [priceRange, setPriceRange] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleSuggestPrice = async () => {
    if (!form.brand) {
      alert("Please enter the brand first ⚠️");
      return;
    }
    try {
      const res = await API.post("cars/price-suggest/", { 
        brand: form.brand,
        fuel_type: form.fuel_type || "",
        seats: form.seats || "",
      });

      setSuggestedPrice(res.data.suggested_price);
      setPriceRange({
        min: res.data.min,
        max: res.data.max,
      });

      setForm((prev) => ({
        ...prev,
        price: res.data.suggested_price,
      }));

    } catch (err) {
      console.error(err);
      alert("AI Suggestion Failed ❌");
    }
  };

  // ✅ INTEGRATED HANDLESUBMIT WITH GEOLOCATION
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const formData = new FormData();

  // ✅ send all form data
  Object.keys(form).forEach((key) => {
    formData.append(key, form[key]);
  });

  // ✅ send images
  images.forEach((img) => {
    if (img) formData.append("images", img);
  });

  try {
    // 🚀 NO GEOLOCATION HERE
    await addCar(formData);

    alert("Car added successfully 🚗");

    // 🔄 RESET FORM
    setForm({
      title: "",
      brand: "",
      price: "",
      location: "",
      description: "",
      registration_number: "",
      fuel_type: "",
      seats: "",
    });

    setImages(Array(5).fill(null));
    setSuggestedPrice(null);
    setPriceRange(null);
    setIsSubmitting(false);

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.error || "Failed ❌");
    setIsSubmitting(false);
  }
};
  // --- Matte UI Styles ---
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f7fa",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden"
  };

  const contentArea = {
    flex: 1,
    padding: "40px",
    zIndex: 2
  };

  const matteCard = {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    maxWidth: "900px",
    margin: "0 auto",
    animation: "slideUp 0.8s ease-out"
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    marginBottom: "20px"
  };

  const imageBox = {
    height: "110px",
    borderRadius: "16px",
    border: "2px dashed #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    background: "#f1f5f9",
    transition: "all 0.3s ease"
  };

  return (
    <div style={containerStyle}>
      <SellerSidebar />

      <style>
        {`
          @keyframes moveOrb {
            0% { transform: translate(0, 0); }
            50% { transform: translate(30px, 50px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .orb {
            position: absolute; width: 400px; height: 400px;
            border-radius: 50%; filter: blur(100px);
            z-index: 1; animation: moveOrb 15s infinite ease-in-out;
            opacity: 0.5;
          }
          input:focus, textarea:focus { 
            border-color: #6366f1 !important; 
            background: #fff !important; 
            box-shadow: 0 4px 12px rgba(99,102,241,0.1); 
          }
          .slot:hover { border-color: #6366f1; background: #f1f5f9; }
        `}
      </style>

      <div className="orb" style={{ background: "#e0e7ff", top: "-100px", right: "-100px" }} />
      <div className="orb" style={{ background: "#fef3c7", bottom: "-100px", left: "-100px", animationDelay: "3s" }} />

      <div style={contentArea}>
        <div style={matteCard}>
          <div style={{ marginBottom: "30px" }}>
            <h1 style={{ margin: 0, color: "#1e293b", fontSize: "28px" }}>Post a New Listing</h1>
            <p style={{ color: "#64748b", marginTop: "5px" }}>Our AI will help you determine the best price for your vehicle.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "8px" }}>Title</label>
                <input name="title" placeholder="e.g. 2023 Honda Civic" value={form.title} onChange={handleChange} style={inputStyle} required />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "8px" }}>Brand</label>
                <input name="brand" placeholder="e.g. Honda" value={form.brand} onChange={handleChange} style={inputStyle} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "8px" }}>Price (₹) / Day</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input name="price" type="number" placeholder="0.00" value={form.price} onChange={handleChange} style={{...inputStyle, marginBottom: 0}} required />
                  <button
                    type="button"
                    onClick={handleSuggestPrice}
                    style={{
                      padding: "0 15px",
                      borderRadius: "12px",
                      border: "none",
                      background: "#6366f1",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      height: "48px",
                      transition: "0.3s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    🤖 Suggest
                  </button>
                </div>
                {suggestedPrice && (
                  <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "8px", fontWeight: "600" }}>
                    AI Suggests: ₹{suggestedPrice} (Range: ₹{priceRange.min} - ₹{priceRange.max})
                  </div>
                )}
              </div>
              <div style={{ marginTop: suggestedPrice ? "-22px" : "0", transition: "0.3s" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "8px" }}>Location</label>
                <input name="location" placeholder="City" value={form.location} onChange={handleChange} style={inputStyle} required />
              </div>
              <div style={{ marginTop: suggestedPrice ? "-22px" : "0", transition: "0.3s" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "8px" }}>Reg. Number</label>
                <input name="registration_number" placeholder="KL-XX-XXXX" value={form.registration_number} onChange={handleChange} style={inputStyle} required />
              </div>
            </div>

            <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "8px" }}>Description</label>
            <textarea name="description" placeholder="Describe your car features..." value={form.description} onChange={handleChange} style={{ ...inputStyle, minHeight: "100px", resize: "none" }} />

            <div style={{ marginTop: "10px" }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginBottom: "15px" }}>Upload Photos (Max 5)</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "15px" }}>
                {images.map((img, index) => (
                  <div key={index} className="slot" style={imageBox}>
                    {img ? (
                      <>
                        <img src={URL.createObjectURL(img)} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <span
                          onClick={() => removeImage(index)}
                          style={{
                            position: "absolute", top: "6px", right: "6px", background: "rgba(220, 38, 38, 0.8)",
                            color: "#fff", borderRadius: "50%", width: "22px", height: "22px",
                            fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                          }}
                        >✕</span>
                      </>
                    ) : (
                      <>
                        <label htmlFor={`image-${index}`} style={{ fontSize: "28px", color: "#94a3b8", cursor: "pointer", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          +
                        </label>
                        <input id={`image-${index}`} type="file" style={{ display: "none" }} onChange={(e) => handleImageChange(e, index)} />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button 
              disabled={isSubmitting} 
              style={{
                width: "100%", padding: "16px", marginTop: "40px",
                background: "#1e293b", color: "#fff", border: "none",
                borderRadius: "12px", fontSize: "16px", fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(30, 41, 59, 0.2)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              {isSubmitting ? "Processing..." : "🚀 Post Advertisement"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCar;