/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import API from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("auth/admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserDetails = async (id) => {
    try {
      const res = await API.get(`auth/admin/users/${id}/`);
      setSelectedUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      const url = isBlocked
        ? `auth/admin/users/${id}/unblock/`
        : `auth/admin/users/${id}/block/`;
      await API.post(url);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <AdminSidebar />

      <style>
        {`
          @keyframes rainbowBg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .main-bg {
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: rainbowBg 15s ease infinite;
            min-height: 100vh;
            flex: 1;
            transition: all 0.5s ease;
          }

          .user-tr { transition: all 0.2s ease; border-bottom: 1px solid rgba(0,0,0,0.05); }
          .user-tr:hover { background: rgba(255, 255, 255, 0.4); transform: scale(1.002); }
          
          .clickable-name { 
            color: #1e293b; 
            cursor: pointer; 
            font-weight: 700; 
            text-decoration: none;
            transition: color 0.2s;
          }
          .clickable-name:hover { color: #3b82f6; }

          .block-btn {
            padding: 8px 18px;
            border-radius: 12px;
            border: none;
            background: #fff;
            color: #1e293b;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          .block-btn:hover { background: #0f172a; color: #fff; transform: translateY(-2px); }

          .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.3); backdrop-filter: blur(8px);
            display: flex; justify-content: flex-end; z-index: 1000;
            animation: fadeIn 0.3s ease;
          }

          .modal-content {
            width: 450px; height: 100%; background: #fff;
            padding: 40px; box-shadow: -10px 0 50px rgba(0,0,0,0.2);
            animation: slideIn 0.4s ease;
            display: flex; flex-direction: column;
          }

          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
        `}
      </style>

      <div className="main-bg" style={styles.mainContent}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>User Management</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: "500" }}>Manage your community and roles</p>
          </div>
          <input
            type="text"
            placeholder="Search by email..."
            style={styles.searchBar}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>USER</th>
                <th style={styles.th}>ROLE</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {users
                .filter((u) => u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((user) => (
                  <tr key={user.id} className="user-tr">
                    <td style={styles.td}>
                      <span
                        className="clickable-name"
                        onClick={() => fetchUserDetails(user.id)}
                      >
                        {user.email}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.roleTag}>{user.role}</span>
                    </td>

                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        background: user.is_blocked ? "#fee2e2" : "#dcfce7",
                        color: user.is_blocked ? "#ef4444" : "#22c55e"
                      }} className="status-badge">
                        {user.is_blocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <button
                        className="block-btn"
                        onClick={() => toggleBlock(user.id, user.is_blocked)}
                      >
                        {user.is_blocked ? "Unblock User" : "Block User"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ MODAL */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>User Profile</h2>
              <button style={styles.closeBtn} onClick={() => setSelectedUser(null)}>✕</button>
            </div>
            
            <div style={styles.divider}></div>

            <div style={styles.profileSection}>
              {selectedUser.profile_image ? (
                <img
                  src={`http://127.0.0.1:8000${selectedUser.profile_image}`}
                  style={styles.profileImg}
                />
              ) : (
                <div style={styles.avatarPlaceholder}>
                   {selectedUser.username ? selectedUser.username[0].toUpperCase() : 'U'}
                </div>
              )}
              <h3 style={{ margin: "10px 0 5px 0" }}>{selectedUser.username}</h3>
              <p style={{ color: "#64748b", margin: 0 }}>{selectedUser.email}</p>
            </div>

            <div style={styles.infoGrid}>
              <div style={styles.infoItem}><b>Role:</b> <span>{selectedUser.role}</span></div>
              <div style={styles.infoItem}><b>Phone:</b> <span>{selectedUser.phone || "N/A"}</span></div>
              <div style={styles.infoItem}><b>Address:</b> <span>{selectedUser.address || "N/A"}</span></div>
              <div style={styles.infoItem}><b>KYC Status:</b> <span>{selectedUser.kyc_status}</span></div>
              <div style={styles.infoItem}>
                <b>Status:</b> 
                <span style={{ color: selectedUser.is_blocked ? "#ef4444" : "#22c55e", fontWeight: "bold" }}>
                  {selectedUser.is_blocked ? " Blocked" : " Active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: "flex", fontFamily: "'Inter', sans-serif" },
  mainContent: { padding: "50px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { fontSize: "32px", fontWeight: "900", color: "#fff", margin: 0 },
  searchBar: { 
    padding: "12px 20px", 
    borderRadius: "15px", 
    border: "none", 
    width: "300px", 
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    outline: "none",
    fontSize: "14px"
  },
  tableWrapper: { 
    background: "rgba(255, 255, 255, 0.8)", 
    backdropFilter: "blur(10px)", 
    borderRadius: "24px", 
    padding: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { borderBottom: "2px solid rgba(0,0,0,0.05)" },
  th: { padding: "15px", textAlign: "left", fontSize: "12px", color: "#64748b", letterSpacing: "1px" },
  td: { padding: "18px 15px", fontSize: "14px", color: "#1e293b" },
  roleTag: { background: "#e2e8f0", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" },
  closeBtn: { background: "#f1f5f9", border: "none", width: "35px", height: "35px", borderRadius: "50%", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" },
  divider: { height: "1px", background: "#f1f5f9", margin: "20px 0" },
  profileSection: { textAlign: "center", marginBottom: "30px" },
  profileImg: { width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "4px solid #f1f5f9" },
  avatarPlaceholder: { width: "100px", height: "100px", borderRadius: "50%", background: "#3b82f6", color: "#fff", fontSize: "40px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontWeight: "bold" },
  infoGrid: { display: "flex", flexDirection: "column", gap: "15px" },
  infoItem: { display: "flex", justifyContent: "space-between", padding: "12px", background: "#f8fafc", borderRadius: "12px", fontSize: "14px" }
};

export default Users;