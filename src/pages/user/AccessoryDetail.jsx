import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { addToCart } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";

function AccessoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await API.get(`accessories/${id}/`);
      setItem(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product details");
    }
  };

  const handleAddToCartClick = async () => {
    setLoading(true);
    try {
      await addToCart(item.id);
      toast.success("Added to cart! 🛒");
    } catch (err) {
      toast.error("Could not add to cart");
    } finally {
      setLoading(false);
    }
  };

  if (!item) return <div style={styles.loader}>Loading Premium Gear...</div>;

  return (
    <div style={styles.pageWrapper}>
      <ToastContainer />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        .thumb-item { transition: all 0.2s ease; cursor: pointer; border: 2px solid transparent; }
        .thumb-active { border-color: #6366f1 !important; opacity: 1 !important; }
        .buy-btn:hover { background: #4f46e5 !important; transform: translateY(-2px); }
      `}</style>

      {/* 🔙 TOP NAV */}
      <div style={styles.topNav}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back to Shop
        </button>
      </div>

      <div style={styles.contentGrid}>
        {/* LEFT: VISUALS */}
        <div style={styles.imageSection}>
          <div style={styles.imageContainer}>
            <img
              src={item.images?.[activeImage]?.image || "/gear-placeholder.png"}
              alt={item.name}
              style={styles.mainImage}
            />
            <div style={styles.stockBadge}>
                {item.stock > 0 ? `In Stock (${item.stock})` : "Out of Stock"}
            </div>
          </div>

          {/* THUMBNAILS */}
          {item.images?.length > 1 && (
            <div style={styles.thumbGallery}>
              {item.images.map((img, idx) => (
                <img
                  key={img.id || idx}
                  src={img.image}
                  className={`thumb-item ${activeImage === idx ? 'thumb-active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                  style={{...styles.thumbImg, opacity: activeImage === idx ? 1 : 0.6}}
                  alt="preview"
                />
              ))}
            </div>
          )}

          <div style={styles.specOverview}>
            <div style={styles.specItem}><span>Category</span><strong>{item.category}</strong></div>
            <div style={styles.specItem}><span>Brand</span><strong>{item.brand}</strong></div>
            <div style={styles.specItem}><span>Warranty</span><strong>1 Year</strong></div>
          </div>
        </div>

        {/* RIGHT: INFO CARD */}
        <div style={styles.detailsSection}>
          <div style={styles.infoHead}>
            <span style={styles.brandLabel}>{item.brand}</span>
            <h1 style={styles.titleText}>{item.name}</h1>
            <div style={styles.priceTag}>₹{item.price.toLocaleString('en-IN')}</div>
          </div>

          <div style={styles.descriptionCard}>
            <h3 style={styles.subHeading}>Product Description</h3>
            <p style={styles.descriptionText}>{item.description}</p>
          </div>

          <div style={styles.actionCard}>
            <h3 style={styles.subHeading}>Purchase Gear</h3>
            <p style={{fontSize: '13px', color: '#94a3b8', marginBottom: '20px'}}>
                Free shipping on all premium automotive accessories.
            </p>
            
            <button 
                onClick={handleAddToCartClick} 
                disabled={loading || item.stock === 0}
                className="buy-btn"
                style={{
                    ...styles.buyBtn, 
                    background: item.stock === 0 ? '#cbd5e1' : '#6366f1',
                    cursor: item.stock === 0 ? 'not-allowed' : 'pointer'
                }}
            >
              {loading ? "Adding..." : item.stock === 0 ? "Out of Stock" : "Add to Cart 🛒"}
            </button>
            
            <div style={styles.trustRow}>
                <span>🛡️ Secure Transaction</span>
                <span>📦 Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { maxWidth: "1200px", margin: "auto", padding: "40px 20px", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1e293b", minHeight: "100vh" },
  loader: { height: "80vh", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "700", color: "#6366f1" },
  topNav: { marginBottom: "30px" },
  backBtn: { background: "none", border: "none", cursor: "pointer", fontWeight: "700", color: "#64748b", fontSize: "15px" },
  contentGrid: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "50px", alignItems: "start" },
  
  imageSection: { position: "sticky", top: "20px" },
  imageContainer: { position: "relative", borderRadius: "24px", overflow: "hidden", background: "#f8fafc", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" },
  mainImage: { width: "100%", height: "450px", objectFit: "contain" },
  stockBadge: { position: "absolute", top: "20px", left: "20px", background: "rgba(15,23,42,0.8)", color: "#fff", padding: "6px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: "700" },
  
  thumbGallery: { display: "flex", gap: "12px", marginTop: "20px", overflowX: "auto" },
  thumbImg: { width: "80px", height: "80px", borderRadius: "12px", objectFit: "cover", background: "#f1f5f9" },
  
  specOverview: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginTop: "30px" },
  specItem: { background: "#f8fafc", padding: "15px", borderRadius: "16px", textAlign: "center", border: "1px solid #f1f5f9" },

  detailsSection: { display: "flex", flexDirection: "column" },
  infoHead: { marginBottom: "30px" },
  brandLabel: { color: "#6366f1", fontWeight: "800", textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px" },
  titleText: { fontSize: "36px", fontWeight: "800", margin: "5px 0 15px 0", color: "#0f172a", letterSpacing: "-1px" },
  priceTag: { fontSize: "32px", fontWeight: "800", color: "#1e293b" },

  descriptionCard: { marginBottom: "40px" },
  subHeading: { fontSize: "18px", fontWeight: "700", marginBottom: "12px" },
  descriptionText: { lineHeight: "1.8", color: "#64748b", fontSize: "16px" },

  actionCard: { background: "#fff", padding: "30px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
  buyBtn: { width: "100%", padding: "18px", color: "#fff", border: "none", borderRadius: "16px", fontWeight: "800", fontSize: "16px", transition: "0.3s ease" },
  trustRow: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', fontSize: '12px', color: '#94a3b8', fontWeight: '600' }
};

export default AccessoryDetail;