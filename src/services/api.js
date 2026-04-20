import axios from "axios";

// ==============================
// 🔧 AXIOS INSTANCE
// ==============================
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// ==============================
// 🔐 REQUEST INTERCEPTOR
// ==============================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("access");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ==============================
// 🔐 RESPONSE INTERCEPTOR
// ==============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("❌ Session expired → Logging out");

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ==============================
// 📦 COMMON CONFIG
// ==============================
const multipartConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

// ==============================
// 🚗 CAR APIs
// ==============================
export const getCars = () => API.get("cars/");
export const getMyCars = () => API.get("cars/my-cars/");
export const addCar = (data) =>
  API.post("cars/create/", data, multipartConfig);
export const updateCar = (id, data) =>
  API.put(`cars/${id}/update/`, data, multipartConfig);
export const deleteCar = (id) =>
  API.delete(`cars/${id}/delete/`);

// ==============================
// 🛒 ACCESSORY APIs
// ==============================
export const getAccessories = () => API.get("accessories/");

export const addAccessory = (data) =>
  API.post("accessories/create/", data, multipartConfig);

export const getMyAccessories = () =>
  API.get("accessories/my/");

export const updateAccessory = (id, data) =>
  API.put(`accessories/${id}/update/`, data, multipartConfig);

export const deleteAccessory = (id) =>
  API.delete(`accessories/${id}/delete/`);

// ✅🔥 FIXED APPROVE (MAIN BUG FIX)
export const approveAccessory = (id) =>
  API.post(`accessories/admin/${id}/approve/`);

// ==============================
// 🧑‍💼 ADMIN USER APIs
// ==============================
export const getUsers = () => API.get("auth/admin/users/");

export const blockUser = (id) =>
  API.post(`auth/admin/users/${id}/block/`);

export const unblockUser = (id) =>
  API.post(`auth/admin/users/${id}/unblock/`);

// ==============================
// 🔐 AUTH APIs
// ==============================
export const loginUser = (data) =>
  API.post("auth/login/", data);

export const registerUser = (data) =>
  API.post("auth/register/", data);

export const googleLogin = (data) =>
  API.post("auth/google-login/", data);

// ==============================
// 👤 PROFILE APIs
// ==============================
export const getProfile = () =>
  API.get("auth/profile/");

export const updateProfile = (data) =>
  API.put("auth/profile/", data, multipartConfig);

// ==============================
// 🪪 KYC APIs
// ==============================
export const submitKYC = (data) =>
  API.post("kyc/submit/", data, multipartConfig);

export const getMyKYC = () =>
  API.get("kyc/me/");

export const getKYCRequests = () =>
  API.get("kyc/admin/kyc/");

export const approveKYC = (id) =>
  API.post(`kyc/admin/kyc/${id}/approve/`);

export const rejectKYC = (id) =>
  API.post(`kyc/admin/kyc/${id}/reject/`);

// ==============================
// 🛒 CART APIs
// ==============================
export const addToCart = (id) =>
  API.post(`cart/add/${id}/`);

export const getCart = () =>
  API.get("cart/");

export const removeCart = (id) =>
  API.delete(`cart/remove/${id}/`);

// ==============================
// ❤️ WISHLIST APIs
// ==============================
export const addToWishlist = (id) =>
  API.post(`wishlist/add/${id}/`);

export const getWishlist = () =>
  API.get("wishlist/");

export const removeWishlist = (id) =>
  API.delete(`wishlist/remove/${id}/`);

// ==============================
// 🤖 CHATBOT (FASTAPI)
// ==============================
export const sendChatMessage = (message) =>
  axios.post("http://127.0.0.1:8001/chatbot", {
    message: message,
  });

export default API;

