import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchCar();
    fetchAvailability();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await API.get(`cars/${id}/`);
      setCar(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAvailability = async () => {
    try {
      const res = await API.get(`rental/availability/${id}/`);
      let disabled = [];
      res.data.booked_dates.forEach((b) => {
        let current = new Date(b.start_date);
        let end = new Date(b.end_date);
        while (current <= end) {
          disabled.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });
      setBookedDates(disabled);
    } catch (err) {
      console.log(err);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select your trip dates");
      return;
    }

    try {
      await API.post(
        "rental/book/",
        {
          car_id: id,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Booking successful ✅");
      fetchAvailability();
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed ❌");
    }
  };

  if (!car) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
      Loading car details...
    </div>
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "40px 60px", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 🔙 BACK BUTTON */}
      <button 
        onClick={() => navigate("/")} 
        style={{
          display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none",
          color: "#64748b", fontWeight: "600", cursor: "pointer", marginBottom: "30px", fontSize: "16px"
        }}
      >
        ← Back to Browse
      </button>

      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
        
        {/* LEFT SECTION: CONTENT */}
        <div style={{ flex: 2 }}>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ color: "#6366f1", fontWeight: "700", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" }}>
              {car.brand}
            </span>
            <h1 style={{ margin: "5px 0", fontSize: "42px", fontWeight: "800", color: "#0f172a" }}>{car.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#64748b" }}>
              <span>📍 {car.location}</span>
              <span>•</span>
              <span style={{ color: "#10b981", fontWeight: "600" }}>Verified Listing</span>
            </div>
          </div>

          {/* 🖼️ IMAGE GALLERY */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px", marginBottom: "30px" }}>
            {car.images?.length > 0 ? (
              <>
                <img src={car.images[0].image} alt="main" style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "20px" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {car.images.slice(1, 3).map((img) => (
                    <img key={img.id} src={img.image} alt="side" style={{ width: "100%", height: "192.5px", objectFit: "cover", borderRadius: "20px" }} />
                  ))}
                </div>
              </>
            ) : (
              <div style={{ gridColumn: "span 2", height: "400px", background: "#e2e8f0", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "50px" }}>🚘</div>
            )}
          </div>

          <div style={{ background: "#fff", padding: "30px", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "15px" }}>About this vehicle</h3>
            <p style={{ lineHeight: "1.7", color: "#475569", fontSize: "16px" }}>{car.description}</p>
          </div>
        </div>

        {/* RIGHT SECTION: BOOKING CARD (Sticky) */}
        <div style={{ flex: 1, position: "sticky", top: "40px" }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            
            <div style={{ marginBottom: "25px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
              <span style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a" }}>₹{car.price}</span>
              <span style={{ color: "#64748b", fontWeight: "500" }}> / day</span>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#475569", marginBottom: "10px" }}>Select Dates</h4>
              <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                <style>{`
                  .react-datepicker { font-family: 'Inter', sans-serif; border: none; }
                  .react-datepicker__header { background: white; border: none; }
                  .react-datepicker__day--selected, .react-datepicker__day--in-range { background: #6366f1 !important; border-radius: 8px; }
                  .react-datepicker__day--disabled { text-decoration: line-through; opacity: 0.3; }
                `}</style>
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => {
                    const [start, end] = dates;
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  minDate={new Date()}
                  excludeDates={bookedDates}
                />
              </div>
            </div>

            <div style={{ background: "#f1f5f9", padding: "15px", borderRadius: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "5px" }}>
                <span style={{ color: "#64748b" }}>Duration</span>
                <span style={{ fontWeight: "700" }}>
                  {startDate && endDate ? `${Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} Days` : "0 Days"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", borderTop: "1px solid #e2e8f0", paddingTop: "10px", marginTop: "10px" }}>
                <span style={{ fontWeight: "600" }}>Total Amount</span>
                <span style={{ fontWeight: "800", color: "#6366f1" }}>
                  ₹{startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) * car.price : 0}
                </span>
              </div>
            </div>

            <button 
              onClick={() => {
  if (!startDate || !endDate) {
    alert("Please select dates");
    return;
  }

  navigate("/car-checkout", {
    state: {
      car,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    },
  });
}}
            >
              Reserve This Car
            </button>

            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "15px" }}>
              You won't be charged yet
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CarDetails;