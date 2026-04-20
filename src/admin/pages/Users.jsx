import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import API from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // 🔥 FIXED
      const res = await API.get("auth/admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      // 🔥 FIXED
      const url = isBlocked
        ? `auth/admin/users/${id}/unblock/`
        : `auth/admin/users/${id}/block/`;

      await API.post(url);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // --- UI (UNCHANGED) ---
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
  };

  const mainContent = {
    flex: 1,
    padding: "40px",
    zIndex: 2,
  };

  const tableWrapper = {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
    border: "1px solid #f1f5f9",
    overflow: "hidden",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    textAlign: "left",
  };

  const thStyle = {
    padding: "15px 20px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  };

  const badgeStyle = (isBlocked) => ({
    padding: "5px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: isBlocked ? "#fee2e2" : "#dcfce7",
    color: isBlocked ? "#dc2626" : "#16a34a",
  });

  return (
    <div style={containerStyle}>
      <AdminSidebar />

      <div style={mainContent}>
        <h1>User Management</h1>

        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span style={badgeStyle(user.is_blocked)}>
                      {user.is_blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        toggleBlock(user.id, user.is_blocked)
                      }
                    >
                      {user.is_blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;