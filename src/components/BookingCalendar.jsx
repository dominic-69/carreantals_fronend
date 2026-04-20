import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const BookingCalendar = ({ carId, token }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/rental/availability/${carId}/`
        );
        const dates = res.data.booked_dates.map((d) => new Date(d));
        setBookedDates(dates);
      } catch (err) {
        console.error("Error fetching availability", err);
      }
    };
    fetchAvailability();
  }, [carId]);

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select a date range first");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/rental/book/",
        {
          car_id: carId,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking successful ✅");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Booking failed ❌");
    }
  };

  // --- Inline Styles ---
  const containerStyle = {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
    maxWidth: "400px",
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
    animation: "fadeInUp 0.6s ease-out",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  };

  const buttonStyle = {
    marginTop: "25px",
    padding: "14px 28px",
    width: "100%",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
  };

  const infoTextStyle = {
    fontSize: "13px",
    color: "#94a3b8",
    marginTop: "15px",
    fontWeight: "500"
  };

  return (
    <div style={containerStyle}>
      {/* Animation Styles */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .react-datepicker {
            border: none !important;
            font-family: 'Inter', sans-serif !important;
          }

          .react-datepicker__header {
            background-color: white !important;
            border-bottom: none !important;
          }

          .react-datepicker__day--selected, 
          .react-datepicker__day--in-range,
          .react-datepicker__day--in-selecting-range {
            background-color: #6366f1 !important;
            border-radius: 8px !important;
          }

          .react-datepicker__day--disabled {
            color: #ccc !important;
            text-decoration: line-through !important;
          }

          .booking-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 20px -3px rgba(99, 102, 241, 0.4);
            filter: brightness(1.1);
          }

          .booking-btn:active {
            transform: translateY(0px);
          }
        `}
      </style>

      <div style={titleStyle}>
        <span>📅</span> Select Trip Dates
      </div>

      <div style={{ display: "inline-block", padding: "10px", background: "#f8fafc", borderRadius: "16px" }}>
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
          minDate={new Date()} // Prevent past bookings
          excludeDates={bookedDates}
          calendarClassName="custom-calendar"
        />
      </div>

      <div style={{ textAlign: "left", marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "#64748b", fontSize: "14px" }}>Start Date:</span>
          <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>
            {startDate ? startDate.toLocaleDateString() : "---"}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#64748b", fontSize: "14px" }}>End Date:</span>
          <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>
            {endDate ? endDate.toLocaleDateString() : "---"}
          </span>
        </div>
      </div>

      <button
        className="booking-btn"
        onClick={handleBooking}
        style={buttonStyle}
      >
        Confirm Booking 🚗
      </button>

      <p style={infoTextStyle}>
        * Booked dates are disabled and cannot be selected.
      </p>
    </div>
  );
};

export default BookingCalendar;