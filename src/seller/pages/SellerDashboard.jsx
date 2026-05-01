/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { getMyCars } from "../../services/api";
import API from "../../services/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SellerDashboard = () => {
  const [carCount, setCarCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // 🚗 Cars
      const carRes = await getMyCars();
      setCarCount(carRes.data.length);

      // 📅 Bookings
      const bookingRes = await API.get("rental/seller-bookings/");
      const bookings = bookingRes.data;

      setBookingCount(bookings.length);

      // 💰 Revenue
      const totalRevenue = bookings.reduce((sum, b) => {
        if (b.status === "confirmed") {
          return sum + parseFloat(b.total_price || 0);
        }
        return sum;
      }, 0);
      setRevenue(totalRevenue);

      // 📊 Chart (monthly revenue)
      const monthly = {};

      bookings.forEach((b) => {
        if (b.status === "confirmed") {
          const date = new Date(b.created_at);
          const month = date.toLocaleString("default", { month: "short" });

          if (!monthly[month]) {
            monthly[month] = 0;
          }

          monthly[month] += parseFloat(b.total_price || 0);
        }
      });

      const chartArr = Object.keys(monthly).map((m) => ({
        month: m,
        revenue: monthly[m],
      }));

      setChartData(chartArr);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f7fa",
    fontFamily: "'Poppins', sans-serif",
  };

  const mainContent = {
    flex: 1,
    padding: "40px",
  };

  const statsGrid = {
    display: "flex",
    gap: "25px",
    marginTop: "30px",
    flexWrap: "wrap",
  };

  const statCard = (color) => ({
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    width: "240px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    borderLeft: `5px solid ${color}`,
  });

  return (
    <div style={containerStyle}>
      <SellerSidebar />

      <div style={mainContent}>
        <h1>Seller Dashboard 🚀</h1>

        {/* 🔥 STATS */}
        <div style={statsGrid}>
          <div style={statCard("#3b82f6")}>
            <h4>MY CARS 🚗</h4>
            <h2>{loading ? "..." : carCount}</h2>
          </div>

          <div style={statCard("#8b5cf6")}>
            <h4>BOOKINGS 📅</h4>
            <h2>{loading ? "..." : bookingCount}</h2>
          </div>

          <div style={statCard("#10b981")}>
            <h4>REVENUE 💰</h4>
            <h2>₹ {loading ? "..." : revenue}</h2>
          </div>
        </div>

        {/* 📊 CHART */}
        <div style={{
          marginTop: "40px",
          background: "#fff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
        }}>
          <h3>📊 Monthly Revenue</h3>

          {chartData.length === 0 ? (
            <p>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;