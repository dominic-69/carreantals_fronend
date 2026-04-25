import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function SellCar() {
  const navigate = useNavigate();

  const carBrands = [
    "Maruti Suzuki", "Hyundai", "Tata Motors", "Mahindra", "Kia", "Toyota", "Honda", 
    "Volkswagen", "Skoda", "MG Motor", "BMW", "Mercedes-Benz", "Audi", "Porsche", 
    "Land Rover", "Volvo", "Renault", "Nissan", "Jeep", "Force Motors"
  ];

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

  return (
    <>
      <style>{`
        @keyframes roadMove { from { background-position: 0px center; } to { background-position: -80px center; } }
        @keyframes drive { 0% { left: -80px; opacity: 0; } 5% { opacity: 1; } 95% { opacity: 1; } 100% { left: 105%; opacity: 0; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .sc-input { 
          padding: 8px 12px; border-radius: 10px; border: 1.5px solid #e2e8f0;
          font-size: 13px; outline: none; background: #f8fafc; transition: all 0.2s;
        }
        .sc-input:focus { 
          border-color: #6366f1 !important; background: #fff !important; 
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important; 
        }
        .sc-upload-box:hover { border-color: #6366f1 !important; background: #fff; }
        .sc-submit:hover { background: #4f46e5 !important; transform: translateY(-1px); box-shadow: 0 10px 15px rgba(99,102,241,0.3); }
        
        /* Hide scrollbar for clean "otta page" look */
        body { overflow: hidden; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.bgGlow1} />
        <div style={styles.road} />
        <div style={styles.carEmoji}>🏎️</div>

        <div style={styles.card}>
          <div style={styles.header}>
            <span style={styles.badge}>Official Dealer Portal</span>
            <h2 style={styles.title}>Register Vehicle</h2>
            <p style={styles.subtitle}>Enter performance specs and gallery</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Listing Title</label>
                <input name="title" placeholder="BMW M4 Competition" onChange={handleChange} className="sc-input" required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Brand</label>
                <input list="car-brands" name="brand" placeholder="Select Brand" onChange={handleChange} className="sc-input" required />
                <datalist id="car-brands">
                  {carBrands.map((brand, idx) => <option key={idx} value={brand} />)}
                </datalist>
              </div>
            </div>

            <div style={styles.row3}>
              <div style={styles.field}>
                <label style={styles.label}>Price (₹)</label>
                <input name="price" type="number" placeholder="4500000" onChange={handleChange} className="sc-input" required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Location</label>
                <input name="location" placeholder="City" onChange={handleChange} className="sc-input" required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Fuel Type</label>
                <select name="fuel_type" onChange={handleChange} className="sc-input">
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>WhatsApp Number</label>
                <input name="whatsapp_number" placeholder="+91" onChange={handleChange} className="sc-input" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Reg. Number</label>
                <input name="registration_number" placeholder="KL-XX-XXXX" onChange={handleChange} className="sc-input" required />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Brief Description</label>
              <textarea name="description" placeholder="Service history, key features..." onChange={handleChange} className="sc-input" style={{height: "60px", resize: "none"}} required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Showroom Gallery <span style={{color: '#94a3b8'}}>(5 Max)</span></label>
              <div style={styles.imageGrid}>
                {images.map((img, index) => (
                  <label key={index} className="sc-upload-box" style={styles.uploadBox}>
                    {img ? (
                      <img src={URL.createObjectURL(img)} alt="preview" style={styles.preview} />
                    ) : (
                      <span style={styles.plus}>+</span>
                    )}
                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(index, e.target.files[0])} />
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.footer}>
                <button type="submit" className="sc-submit" style={styles.submitBtn}>
                  Publish Listing 🚀
                </button>
                <button type="button" onClick={() => navigate("/")} style={styles.cancelBtn}>
                  Back to Showroom
                </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    height: "100vh", background: "#020617", display: "flex", 
    alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative"
  },
  bgGlow1: {
    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "600px",
    background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", pointerEvents: "none"
  },
  road: {
    position: "absolute", bottom: 0, width: "100%", height: "20px", background: "#0f172a",
    backgroundImage: "linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.03) 50%)",
    backgroundSize: "40px 2px", backgroundRepeat: "repeat-x", backgroundPosition: "0 center",
    animation: "roadMove 0.5s linear infinite"
  },
  carEmoji: {
    position: "absolute", bottom: "5px", fontSize: "20px", animation: "drive 10s linear infinite"
  },
  card: {
    width: "520px", background: "#fff", borderRadius: "24px", padding: "30px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)", animation: "fadeSlideUp 0.5s ease-out",
    zIndex: 10
  },
  header: { textAlign: "center", marginBottom: "20px" },
  badge: {
    background: "#f5f3ff", color: "#6366f1", padding: "4px 12px", borderRadius: "50px",
    fontSize: "10px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase"
  },
  title: { fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: "8px 0 2px" },
  subtitle: { color: "#64748b", fontSize: "13px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" },
  field: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", paddingLeft: "4px" },
  imageGrid: { display: "flex", gap: "8px" },
  uploadBox: {
    flex: 1, height: "65px", border: "1.5px dashed #e2e8f0", borderRadius: "12px",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
    background: "#f8fafc", transition: "all 0.2s"
  },
  preview: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" },
  plus: { fontSize: "20px", color: "#cbd5e1" },
  footer: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "5px" },
  submitBtn: {
    padding: "14px", background: "#6366f1", color: "#fff", border: "none",
    borderRadius: "12px", fontWeight: "800", fontSize: "14px", cursor: "pointer",
    transition: "all 0.3s ease"
  },
  cancelBtn: {
    background: "none", border: "none", color: "#94a3b8", fontSize: "12px",
    fontWeight: "600", cursor: "pointer", textDecoration: "none"
  }
};

export default SellCar;