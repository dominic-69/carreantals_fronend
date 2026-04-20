import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 🔐 Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";

// 🚗 User Pages

import Home from "./pages/user/Home";
import CarDetails from "./pages/user/CarDetails";
import Profile from "./pages/user/Profile";
import KYC from "./pages/user/KYC";
import Accessories from "./pages/user/Accessories";
import Cart from "./pages/user/Cart";
import Wishlist from "./pages/user/Wishlist";
import SellCar from "./pages/user/SellCar";
import BuyCars from "./pages/user/BuyCars";
import BuyCarDetails from "./pages/user/BuyCarDetails";
import Chatbot from "./pages/user/Chatbot";






// 🔒 Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

// 🧑‍💼 Admin
import AdminDashboard from "./admin/pages/AdminDashboard";
import Users from "./admin/pages/Users";
import Orders from "./admin/pages/Orders";
import KYCRequests from "./admin/pages/KYCRequests";
import AdminChat from "./admin/pages/AdminChat";
import AccessoriesAdmin from "./admin/pages/Accessories";
import AdminCarApproval from "./admin/pages/AdminCarApproval";


// 🏪 Seller
import SellerDashboard from "./seller/pages/SellerDashboard";
import AddCar from "./seller/pages/AddCar";
import MyCars from "./seller/pages/MyCars";
import EditCar from "./seller/pages/EditCar"; 
import Chat from "./pages/chat/Chat";
import AddAccessory from "./seller/pages/AddAccessory";
import MyAccessories from "./seller/pages/MyAccessories";
import EditAccessory from "./seller/pages/EditAccessory";




// 🔓 Public Route
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("access");
  return token ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* AUTH */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* USER */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/car/:id" element={<ProtectedRoute><CarDetails /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/sell-car" element={<SellCar />} />
        <Route path="/buy-cars" element={<BuyCars />} />
        <Route path="/chatbot" element={<Chatbot />} />


<Route path="/buy-car/:id" element={<BuyCarDetails />} />



        <Route
          path="/kyc"
          element={
            <ProtectedRoute>
              <KYC />
            </ProtectedRoute>
          }
        />
<Route
  path="/accessories"
  element={
    <ProtectedRoute>
      <Accessories />
    </ProtectedRoute>
  }
/>
        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/car-approvals"
  element={
    <ProtectedRoute role="admin">
      <AdminCarApproval />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/chat"
  element={
    <ProtectedRoute role="admin">
      <AdminChat />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/accessories"
  element={
    <ProtectedRoute role="admin">
      <AccessoriesAdmin />
    </ProtectedRoute>
  }
/>
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="admin">
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/kyc"
          element={
            <ProtectedRoute role="admin">
              <KYCRequests />
            </ProtectedRoute>
          }
        />

        {/* SELLER */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute role="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/seller/edit-accessory/:id"
  element={
    <ProtectedRoute role="seller">
      <EditAccessory />
    </ProtectedRoute>
  }
/>
        <Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>
<Route
  path="/seller/add-accessory"
  element={
    <ProtectedRoute role="seller">
      <AddAccessory />
    </ProtectedRoute>
  }
/>

<Route
  path="/seller/my-accessories"
  element={
    <ProtectedRoute role="seller">
      <MyAccessories />
    </ProtectedRoute>
  }
/>

        <Route
          path="/seller/add-car"
          element={
            <ProtectedRoute role="seller">
              <AddCar />
            </ProtectedRoute>
          }
        />

        {/* ✅ FIXED EDIT ROUTE */}
        <Route
          path="/seller/edit-car/:id"
          element={
            <ProtectedRoute role="seller">
              <EditCar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/my-cars"
          element={
            <ProtectedRoute role="seller">
              <MyCars />
            </ProtectedRoute>
          }
        />
        <Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  }
/>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;