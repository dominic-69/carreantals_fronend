import React, { useEffect, useState } from "react";
import API from "../../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("access");

  const fetchBookings = async () => {
    try {
      const res = await API.get("rental/my-bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelBooking = async (id) => {
    try {
      await API.post(`rental/cancel/${id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchBookings();
    } catch (err) {
      alert("Cancel failed ❌");
    }
  };

  // ✅ NEW FUNCTION (IMPORTANT)
  const payRemaining = async (bookingId) => {
    try {
      const res = await API.post(
        "rental/pay-remaining/",
        { booking_id: bookingId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const amount = res.data.amount;

      const options = {
        key: "rzp_test_Sg7JEq3JdVsjLK",
        amount: amount * 100,
        currency: "INR",
        handler: async function () {
          await API.post(
            "rental/final-payment-success/",
            { booking_id: bookingId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          alert("Payment complete 🎉");
          fetchBookings();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Payment failed ❌");
    }
  };

  return (
    <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "30px" }}>My Bookings 🚗</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            style={{
              background: "#fff",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "16px",
              display: "flex",
              gap: "20px",
              alignItems: "center"
            }}
          >
            {/* IMAGE (FIXED 🔥) */}
            {b.car.images?.[0]?.image ? (
              <img
                src={b.car.images[0].image}
                alt="car"
                style={{
                  width: "120px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />
            ) : (
              <div style={{ width: "120px", height: "80px", background: "#e2e8f0" }} />
            )}

            {/* DETAILS */}
            <div style={{ flex: 1 }}>
              <h3>{b.car.title}</h3>
              <p>{b.start_date} → {b.end_date}</p>

              {/* ✅ PRICE DETAILS */}
              <p>Total: ₹{b.total_price}</p>
              <p>Advance Paid: ₹{b.advance_amount}</p>
              <p>Remaining: ₹{b.remaining_amount}</p>

              {/* STATUS */}
              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  marginRight: "10px",
                  background:
                    b.status === "confirmed"
                      ? "#dcfce7"
                      : b.status === "pending"
                      ? "#fef9c3"
                      : "#fee2e2",
                }}
              >
                {b.status}
              </span>

              {/* PAYMENT STATUS */}
              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  background:
                    b.payment_status === "paid"
                      ? "#dcfce7"
                      : b.payment_status === "partial"
                      ? "#e0f2fe"
                      : "#fee2e2",
                }}
              >
                {b.payment_status}
              </span>

              {/* ✅ PAY REMAINING BUTTON */}
              {b.payment_status === "partial" && b.status === "pending" && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => payRemaining(b.id)}
                    style={{
                      padding: "10px",
                      background: "#22c55e",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer"
                    }}
                  >
                    Pay Remaining 💰
                  </button>
                </div>
              )}
            </div>

            {/* ACTION */}
            {b.status !== "cancelled" && (
              <button
                onClick={() => cancelBooking(b.id)}
                style={{
                  padding: "10px 15px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;