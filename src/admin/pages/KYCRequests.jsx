import React, { useEffect, useState } from "react";
import { getKYCRequests, approveKYC, rejectKYC } from "../../services/api";

function KYCRequests() {
  const [kycList, setKycList] = useState([]);

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    const res = await getKYCRequests();
    setKycList(res.data);
  };

  const handleApprove = async (id) => {
    await approveKYC(id);
    fetchKYC();
  };

  const handleReject = async (id) => {
    await rejectKYC(id);
    fetchKYC();
  };

  // --- Standardized UI Styles ---
  const containerStyle = {
    padding: "40px",
    background: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: "#1e293b",
  };

  const headerBoxStyle = {
    maxWidth: "1000px",
    margin: "0 auto 32px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "20px",
  };

  const cardStyle = {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    maxWidth: "1000px",
    margin: "0 auto 20px auto",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "transform 0.2s ease",
  };

  const badgeStyle = (status) => ({
    padding: "6px 14px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    backgroundColor: 
      status === "approved" ? "#dcfce7" : 
      status === "pending" ? "#fef9c3" : "#fee2e2",
    color: 
      status === "approved" ? "#15803d" : 
      status === "pending" ? "#a16207" : "#b91c1c",
  });

  const imgWrapperStyle = {
    textAlign: "center",
    background: "#f1f5f9",
    padding: "8px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  };

  const actionButtonStyle = (type) => ({
    padding: "10px 24px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    transition: "all 0.2s",
    border: type === "approve" ? "none" : "1px solid #fecaca",
    background: type === "approve" ? "#6366f1" : "#fff",
    color: type === "approve" ? "#fff" : "#ef4444",
    boxShadow: type === "approve" ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none",
  });

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={headerBoxStyle}>
        <div>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>KYC Verifications</h2>
          <p style={{ color: "#64748b", margin: "5px 0 0 0", fontSize: "15px" }}>Validate user documents and identity</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "14px", color: "#94a3b8" }}>Total Pending</span>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#6366f1" }}>
            {kycList.filter(k => k.status === 'pending').length}
          </div>
        </div>
      </div>

      {kycList.length > 0 ? (
        kycList.map((kyc) => (
          <div key={kyc.id} style={cardStyle}>
            
            {/* User Details */}
            <div style={{ flex: "1", minWidth: "250px" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", fontWeight: "600" }}>USER NAME</div>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: "700", color: "#334155" }}>
                {kyc.full_name}
              </h4>
              <div style={badgeStyle(kyc.status)}>{kyc.status}</div>
              <p style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "15px", fontFamily: "monospace" }}>
                REF_ID: {kyc.id}
              </p>
            </div>

            {/* Documents Preview */}
            <div style={{ display: "flex", gap: "20px", flex: "2", justifyContent: "center", minWidth: "350px", padding: "10px 0" }}>
              <div style={imgWrapperStyle}>
                <img 
                  src={kyc.license_image} 
                  alt="license" 
                  style={{ borderRadius: "6px", objectFit: "cover", display: "block", cursor: "pointer" }} 
                  width="150" height="95" 
                />
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", marginTop: "6px" }}>GOVT ID CARD</div>
              </div>
              <div style={imgWrapperStyle}>
                <img 
                  src={kyc.selfie_image} 
                  alt="selfie" 
                  style={{ borderRadius: "6px", objectFit: "cover", display: "block", cursor: "pointer" }} 
                  width="150" height="95" 
                />
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", marginTop: "6px" }}>USER SELFIE</div>
              </div>
            </div>

            {/* Decision Buttons */}
            <div style={{ flex: "1", textAlign: "right", minWidth: "220px" }}>
              {kyc.status === "pending" ? (
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => handleReject(kyc.id)}
                    style={actionButtonStyle("reject")}
                    onMouseOver={(e) => e.currentTarget.style.background = "#fef2f2"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#fff"}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(kyc.id)}
                    style={actionButtonStyle("approve")}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    Approve
                  </button>
                </div>
              ) : (
                <div style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  color: "#94a3b8", 
                  fontSize: "14px", 
                  fontWeight: "600",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px dashed #cbd5e1"
                }}>
                  <span style={{ fontSize: "18px" }}>✓</span> Processed
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", marginTop: "120px" }}>
          <div style={{ fontSize: "50px", marginBottom: "20px" }}>📁</div>
          <h3 style={{ color: "#64748b", margin: 0 }}>No Pending Requests</h3>
          <p style={{ color: "#94a3b8" }}>Everything is up to date!</p>
        </div>
      )}
    </div>
  );
}

export default KYCRequests;