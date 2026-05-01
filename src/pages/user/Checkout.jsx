import React, { useEffect, useState } from "react";
import { getCart, createOrder } from "../../services/api";
import API from "../../services/api";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [baseTotal, setBaseTotal] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [kycError, setKycError] = useState(false); // 🔥 NEW STATE FOR MODAL

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const deliveryCharge = paymentMethod === "cod" ? 40 : 0;
  const finalTotal = baseTotal + deliveryCharge;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.items || []);
      setBaseTotal(res.data.total || 0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      alert("⚠️ Please fill all delivery details");
      return;
    }

    if (cart.length === 0) {
      alert("🛒 Your cart is empty");
      return;
    }

    setLoading(true);

    if (paymentMethod === "online") {
      handleRazorpayPayment();
    } else {
      handleCODPayment();
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      if (!window.Razorpay) {
        alert("Razorpay not loaded ❌");
        setLoading(false);
        return;
      }

      const res = await createOrder(); 

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: "INR",
        name: "Car Accessories Store",
        description: "Online Payment",
        order_id: res.data.order_id,
        handler: async function (response) {
          submitCheckoutToBackend(response.razorpay_payment_id);
        },
        prefill: { name: form.name, contact: form.phone },
        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("❌ Razorpay Initialization Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCODPayment = async () => {
    try {
      await submitCheckoutToBackend("CASH_ON_DELIVERY");
    } catch (err) {
      // Error is handled inside submitCheckoutToBackend
    } finally {
      setLoading(false);
    }
  };

  // 📝 SHARED SUBMIT FUNCTION (UPDATED WITH KYC CHECK)
  const submitCheckoutToBackend = async (payId) => {
    try {
      await API.post("cart/checkout/", {
        ...form,
        payment_id: payId,
        payment_method: paymentMethod,
        total_price: finalTotal,
      });
      alert("🎉 Order placed successfully!");
      window.location.href = "/";
    } catch (err) {
      // 🔥 KYC CHECK LOGIC
      if (err.response?.status === 403) {
        setKycError(true);
        return;
      }
      alert("❌ Order saving failed");
    }
  };

  return (
    <div style={styles.container}>
      {/* 🔥 PRO UI KYC POPUP MODAL */}
      {kycError && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={{ fontSize: "50px", marginBottom: "10px" }}>⚠️</div>
            <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>KYC Verification Required</h3>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              To ensure safety and compliance, you must complete your KYC verification before placing this order.
            </p>

            <button 
              onClick={() => window.location.href = "/kyc"} 
              style={{ ...styles.btn, marginBottom: "10px" }}
            >
              Complete KYC Now
            </button>

            <button 
              onClick={() => setKycError(false)} 
              style={{ ...styles.btn, background: "#f1f5f9", color: "#475569", boxShadow: "none" }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* LEFT: CART SUMMARY */}
      <div style={styles.left}>
        <h2 style={{ marginBottom: "20px" }}>🧾 Order Summary</h2>
        <div style={styles.cartList}>
          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            cart.map((item) => (
              <div key={item.cart_item_id} style={styles.card}>
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  style={styles.imageStyle}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>
                  <p style={styles.itemDetail}>Price: ₹{item.price} | Qty: {item.quantity}</p>
                  <p style={styles.itemSubtotal}>Subtotal: ₹{item.subtotal}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: DELIVERY & PAYMENT */}
      <div style={styles.right}>
        <h3 style={styles.sectionTitle}>📦 Delivery Details</h3>
        <div style={styles.formGroup}>
          <input name="name" placeholder="Full Name" onChange={handleChange} style={styles.input} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} style={styles.input} />
          <textarea name="address" placeholder="Full Address" onChange={handleChange} style={styles.textarea} />
          <div style={{ display: "flex", gap: "10px" }}>
            <input name="city" placeholder="City" onChange={handleChange} style={styles.input} />
            <input name="pincode" placeholder="Pincode" onChange={handleChange} style={styles.input} />
          </div>
        </div>

        <h3 style={styles.sectionTitle}>💳 Payment Method</h3>
        <div style={styles.paymentSelector}>
          <label style={{ ...styles.payOption, borderColor: paymentMethod === 'online' ? '#10b981' : '#ddd' }}>
            <input 
              type="radio" 
              name="payMethod" 
              checked={paymentMethod === 'online'} 
              onChange={() => setPaymentMethod('online')} 
            />
            <div style={{ marginLeft: "10px" }}>
              <b>Online Payment</b>
              <div style={{ fontSize: "12px", color: "#666" }}>Pay via UPI/Card/Netbanking</div>
            </div>
          </label>

          <label style={{ ...styles.payOption, borderColor: paymentMethod === 'cod' ? '#10b981' : '#ddd' }}>
            <input 
              type="radio" 
              name="payMethod" 
              checked={paymentMethod === 'cod'} 
              onChange={() => setPaymentMethod('cod')} 
            />
            <div style={{ marginLeft: "10px" }}>
              <b>Cash on Delivery</b>
              <div style={{ fontSize: "12px", color: "#e63946" }}>Extra ₹40 delivery charge</div>
            </div>
          </label>
        </div>

        <div style={styles.priceSummary}>
          <div style={styles.priceRow}>
            <span>Cart Total:</span>
            <span>₹{baseTotal}</span>
          </div>
          <div style={styles.priceRow}>
            <span>Delivery Charge:</span>
            <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : "FREE"}</span>
          </div>
          <hr style={{ border: "0.5px solid #eee", margin: "10px 0" }} />
          <div style={{ ...styles.priceRow, fontWeight: "bold", fontSize: "18px" }}>
            <span>Final Amount:</span>
            <span style={{ color: "#10b981" }}>₹{finalTotal}</span>
          </div>
        </div>

        <button onClick={handlePlaceOrder} disabled={loading} style={styles.btn}>
          {loading ? "Processing..." : paymentMethod === 'cod' ? "Confirm Order (COD)" : "Proceed to Pay 💳"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  // Existing Styles...
  container: { display: "flex", gap: "40px", padding: "40px 10%", background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  left: { flex: 1.5 },
  right: { flex: 1, background: "#fff", padding: "25px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", height: "fit-content" },
  sectionTitle: { fontSize: "18px", marginBottom: "15px", borderLeft: "4px solid #10b981", paddingLeft: "10px" },
  cartList: { display: "flex", flexDirection: "column", gap: "15px" },
  card: { display: "flex", gap: "20px", background: "#fff", padding: "15px", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" },
  imageStyle: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" },
  itemDetail: { fontSize: "13px", color: "#64748b", margin: "0" },
  itemSubtotal: { fontWeight: "600", color: "#1e293b", marginTop: "5px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
  input: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" },
  textarea: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", height: "80px", outline: "none", fontSize: "14px", fontFamily: "inherit" },
  paymentSelector: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
  payOption: { display: "flex", alignItems: "center", padding: "12px", border: "2px solid #ddd", borderRadius: "10px", cursor: "pointer", transition: "0.2s" },
  priceSummary: { background: "#f8fafc", padding: "15px", borderRadius: "10px", marginBottom: "20px" },
  priceRow: { display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px" },
  btn: { width: "100%", padding: "15px", background: "#10b981", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", transition: "0.3s", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)" },

  // 🔥 MODAL STYLES
  modalOverlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(15, 23, 42, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000,
    backdropFilter: "blur(4px)"
  },
  modalCard: {
    background: "#fff", padding: "40px", borderRadius: "24px", textAlign: "center",
    maxWidth: "400px", width: "90%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
  }
};

export default Checkout;