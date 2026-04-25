/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react"; // ✅ added useState
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

function CarCheckout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <h2>No booking data found ❌</h2>;

  const { car, startDate, endDate } = state;
  const token = localStorage.getItem("access");

  const [agree, setAgree] = useState(false); // ✅ NEW

  const days =
    Math.ceil(
      (new Date(endDate) - new Date(startDate)) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  const total = days * car.price;

  // ✅ NEW CALCULATIONS
  const advance = total * 0.4;
  const remaining = total - advance;

 const handleConfirmBooking = async () => {
  if (!agree) {
    alert("Please accept Terms & Conditions ⚠️");
    return;
  }

  try {
    const res = await API.post(
      "rental/book/",
      {
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { booking_id, amount } = res.data; // 🔥 amount = 40%

    const options = {
      key: "rzp_test_Sg7JEq3JdVsjLK",
      amount: amount * 100, // ✅ NOW 40% ONLY
      currency: "INR",
      handler: async function () {
        await API.post(
          "rental/payment-success/",
          { booking_id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        navigate("/booking-success");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    alert(err.response?.data?.error || "Booking failed ❌");
  }
};
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>Checkout 🚗</h1>

      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
        
        {/* LEFT SIDE */}
        <div style={{ flex: 2 }}>
          
          {/* IMAGE GALLERY */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "10px",
            marginBottom: "20px"
          }}>
            {car.images?.length > 0 ? (
              <>
                <img
                  src={car.images[0].image}
                  alt="main"
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "16px"
                  }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {car.images.slice(1, 3).map((img) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt="thumb"
                      style={{
                        width: "100%",
                        height: "145px",
                        objectFit: "cover",
                        borderRadius: "16px"
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div style={{
                height: "300px",
                background: "#e2e8f0",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                🚘
              </div>
            )}
          </div>

          {/* CAR DETAILS */}
          <div style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "20px"
          }}>
            <h2>{car.title}</h2>
            <p style={{ color: "#64748b" }}>📍 {car.location}</p>
            <p style={{ marginTop: "10px" }}>{car.description}</p>
          </div>

          {/* SELLER INFO */}
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "16px"
          }}>
            <h3>Seller Info</h3>
            <p><strong>Name:</strong> {car.seller?.name}</p>
            <p><strong>Email:</strong> {car.seller?.email}</p>
          </div>
        </div>

        {/* RIGHT SIDE (STICKY CARD) */}
        <div style={{
          flex: 1,
          position: "sticky",
          top: "40px"
        }}>
          <div style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
          }}>
            <h2 style={{ marginBottom: "15px" }}>Booking Summary</h2>

            <p><strong>From:</strong> {startDate}</p>
            <p><strong>To:</strong> {endDate}</p>
            <p><strong>Days:</strong> {days}</p>

            <hr style={{ margin: "15px 0" }} />

            <div style={{
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>₹{car.price} × {days}</span>
              <span>₹{total}</span>
            </div>

            <hr style={{ margin: "15px 0" }} />

            {/* ✅ NEW PAYMENT BREAKDOWN */}
            <p><strong>Advance (40%):</strong> ₹{advance}</p>
            <p><strong>Remaining:</strong> ₹{remaining}</p>

            <hr style={{ margin: "15px 0" }} />

            <h2>Total: ₹{total}</h2>

            {/* ✅ TERMS */}
            <label style={{ display: "block", marginTop: "10px" }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />{" "}
              I agree to Terms & Conditions
            </label>

            <button
              onClick={handleConfirmBooking}
              disabled={!agree} // ✅ BLOCK BUTTON
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "15px",
                background: agree ? "#6366f1" : "#9ca3af",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontWeight: "700",
                cursor: agree ? "pointer" : "not-allowed"
              }}
            >
              Confirm & Pay (40%)
            </button>

            <p style={{
              fontSize: "12px",
              color: "#94a3b8",
              textAlign: "center",
              marginTop: "10px"
            }}>
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CarCheckout;