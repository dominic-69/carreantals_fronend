import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateCar } from "../../services/api";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    brand: "",
    price: "",
    location: "",
    description: "",
    registration_number: "",
  });

  const [images, setImages] = useState(Array(5).fill(null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCar = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/cars/${id}/`);
    const data = await res.json();
    setForm(data);

    const existing = Array(5).fill(null);
    if (data.images) {
      data.images.forEach((img, index) => {
        if (index < 5) {
          existing[index] = img.image; 
        }
      });
    }
    setImages(existing);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((img) => {
      if (img && typeof img !== "string") {
        formData.append("images", img);
      }
    });

    try {
      await updateCar(id, formData);
      alert("Updated successfully ✏️");
      navigate("/seller/my-cars");
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // --- Styled UI Components ---
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#f0f4f8",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif"
  };

  const glassCard = {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    width: "100%",
    maxWidth: "800px",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
    zIndex: 2,
    border: "1px solid rgba(255,255,255,0.5)"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.3s ease"
  };

  const slotStyle = {
    width: "100%",
    height: "100px",
    borderRadius: "12px",
    border: "2px dashed #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#fff",
    transition: "all 0.2s ease"
  };

  return (
    <div style={containerStyle}>
      {/* ANIMATED BACKGROUND */}
      <style>
        {`
          @keyframes move {
            0% { transform: translate(0, 0); }
            50% { transform: translate(50px, 80px); }
            100% { transform: translate(0, 0); }
          }
          .bg-orb {
            position: absolute; width: 300px; height: 300px;
            border-radius: 50%; filter: blur(80px);
            z-index: 1; animation: move 10s infinite ease-in-out;
          }
          .input-focus:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
          .slot:hover { border-color: #3b82f6; background: #f0f7ff; }
        `}
      </style>
      
      <div className="bg-orb" style={{ background: "#dbeafe", top: "-50px", left: "-50px" }} />
      <div className="bg-orb" style={{ background: "#ede9fe", bottom: "-50px", right: "-50px", animationDelay: "2s" }} />

      <div style={glassCard}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ margin: 0, color: "#1e293b", fontSize: "28px" }}>Edit Car Listing</h2>
          <p style={{ color: "#64748b", marginTop: "8px" }}>Update your vehicle's information and gallery</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{fontSize: '13px', fontWeight: '600', color: '#475569'}}>Title</label>
              <input className="input-focus" name="title" value={form.title} onChange={handleChange} style={inputStyle} placeholder="e.g. BMW M4 Competition" />
            </div>
            <div>
              <label style={{fontSize: '13px', fontWeight: '600', color: '#475569'}}>Brand</label>
              <input className="input-focus" name="brand" value={form.brand} onChange={handleChange} style={inputStyle} placeholder="e.g. BMW" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{fontSize: '13px', fontWeight: '600', color: '#475569'}}>Price (₹)</label>
              <input className="input-focus" name="price" value={form.price} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{fontSize: '13px', fontWeight: '600', color: '#475569'}}>Location</label>
              <input className="input-focus" name="location" value={form.location} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{fontSize: '13px', fontWeight: '600', color: '#475569'}}>Registration No.</label>
              <input className="input-focus" name="registration_number" value={form.registration_number} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <label style={{fontSize: '13px', fontWeight: '600', color: '#475569'}}>Description</label>
          <textarea className="input-focus" name="description" value={form.description} onChange={handleChange} style={{ ...inputStyle, minHeight: "80px", resize: "none" }} />

          {/* 🔥 5 SLOT IMAGE UI */}
          <div style={{ marginTop: "10px" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginBottom: "12px" }}>Vehicle Gallery (Max 5 Photos)</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
              {images.map((img, index) => (
                <div key={index} className="slot" style={slotStyle}>
                  {img ? (
                    <>
                      <img
                        src={typeof img === "string" ? img : URL.createObjectURL(img)}
                        alt="preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div
                        onClick={() => removeImage(index)}
                        style={{
                          position: "absolute", top: "4px", right: "4px",
                          background: "rgba(239, 68, 68, 0.9)", color: "#fff",
                          borderRadius: "6px", width: "22px", height: "22px",
                          fontSize: "10px", display: "flex", alignItems: "center",
                          justifyContent: "center", cursor: "pointer", fontWeight: "bold"
                        }}
                      >✕</div>
                    </>
                  ) : (
                    <>
                      <label htmlFor={`edit-image-${index}`} style={{ fontSize: "24px", color: "#94a3b8", cursor: "pointer", width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        +
                      </label>
                      <input
                        id={`edit-image-${index}`}
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageChange(e, index)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "none", cursor: "pointer", fontWeight: "600", color: "#64748b" }}
            >
              Cancel
            </button>
            <button 
              disabled={loading}
              style={{
                flex: 2, padding: "14px", borderRadius: "12px", border: "none",
                background: loading ? "#94a3b8" : "linear-gradient(90deg, #2563eb, #3b82f6)",
                color: "#fff", fontWeight: "bold", fontSize: "16px", cursor: "pointer",
                boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)"
              }}
            >
              {loading ? "Saving Changes..." : "Update Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCar;