/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Chat() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const ws = useRef(null);
  const bottomRef = useRef();

  // 🔥 LOAD USER
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

  // 🔥 START CHAT
  const startChat = async () => {
    try {
      let res;
      if (user.role === "seller") {
        res = await API.post("chat/admin-seller/start/");
      } else if (user.role === "admin") {
        res = await API.post("chat/admin-seller/start/", {
          seller_id: 2, // 🔥 change later
        });
      }

      setChatId(res.data.chat_id);
      const msgs = await API.get(`chat/${res.data.chat_id}/messages/`);
      setMessages(msgs.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 WEBSOCKET CONNECT
  useEffect(() => {
    if (!chatId) return;
    ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${chatId}/`);
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [
        ...prev,
        { text: data.message, sender_name: data.sender },
      ]);
    };
    return () => ws.current?.close();
  }, [chatId]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 SEND MESSAGE
  const sendMessage = () => {
    if (!text.trim()) return;
    if (!ws.current || ws.current.readyState !== 1) {
      console.log("❌ WebSocket not connected");
      return;
    }
    ws.current.send(JSON.stringify({ message: text }));
    setText("");
  };

  const handleBack = () => {
    const target = user?.role === "admin" ? "/admin" : "/seller";
    navigate(target);
  };

  return (
    <div style={styles.container}>
      {/* LEFT PANEL */}
      <div style={styles.leftPanel}>
        <div>
          <button style={styles.backBtn} onClick={handleBack}>
            ← Dashboard
          </button>
          <h2 style={styles.sidebarTitle}>Messages</h2>
          <div style={styles.statusBox}>
            <div style={styles.dot}></div>
            <span>Support Active</span>
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button style={styles.startBtn} onClick={startChat}>
            New Inquiry
          </button>
          <p style={styles.sidebarFooter}>
            Official Admin ↔ Seller channel
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.chatArea}>
        {!chatId ? (
          <div style={styles.empty}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>💬</div>
            <h3>Direct Communication Channel</h3>
            <p>Start a secure conversation with the portal management.</p>
            <button style={styles.initBtn} onClick={startChat}>Open Chat Now</button>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div style={styles.header}>
              <div style={styles.headerInfo}>
                <div style={styles.avatar}>#</div>
                <div>
                  <div style={styles.headerTitle}>Support Room #{chatId}</div>
                  <div style={styles.headerSub}>End-to-end encrypted</div>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div style={styles.messagesContainer}>
              {messages.map((msg, i) => {
                const isMe = msg.sender_name === user?.username;
                return (
                  <div
                    key={i}
                    style={{
                      ...styles.messageWrapper,
                      justifyContent: isMe ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        ...styles.bubble,
                        background: isMe ? "#6366f1" : "#fff",
                        color: isMe ? "#fff" : "#1e293b",
                        borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        boxShadow: isMe ? "0 4px 15px rgba(99, 102, 241, 0.2)" : "0 4px 15px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div style={styles.senderName}>{isMe ? "You" : msg.sender_name}</div>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}></div>
            </div>

            {/* INPUT */}
            <div style={styles.inputArea}>
              <div style={styles.inputContainer}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Describe your issue or request..."
                  style={styles.input}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} style={styles.sendBtn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Inter', sans-serif",
    background: "#f8fafc",
    overflow: "hidden",
  },
  leftPanel: {
    width: "280px",
    background: "#0f172a",
    color: "#fff",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  backBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#cbd5e1",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    marginBottom: "30px",
    transition: "0.2s",
  },
  sidebarTitle: { margin: "0 0 10px 0", fontSize: "24px", fontWeight: "800" },
  statusBox: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#94a3b8" },
  dot: { width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" },
  startBtn: {
    padding: "14px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
  },
  sidebarFooter: { marginTop: "20px", fontSize: "11px", color: "#475569", textAlign: "center" },
  chatArea: { flex: 1, display: "flex", flexDirection: "column", background: "#f1f5f9" },
  header: {
    padding: "15px 30px",
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
  },
  headerInfo: { display: "flex", alignItems: "center", gap: "15px" },
  avatar: { width: "40px", height: "40px", background: "#f1f5f9", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", color: "#6366f1" },
  headerTitle: { fontWeight: "800", color: "#1e293b", fontSize: "16px" },
  headerSub: { fontSize: "11px", color: "#94a3b8", fontWeight: "600" },
  messagesContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    gap: "15px",
    overflowY: "auto",
  },
  messageWrapper: { display: "flex", width: "100%" },
  bubble: {
    padding: "12px 18px",
    maxWidth: "65%",
    fontSize: "14px",
    lineHeight: "1.5",
    position: "relative",
  },
  senderName: { fontSize: "10px", fontWeight: "800", marginBottom: "4px", opacity: 0.7, textTransform: "uppercase" },
  inputArea: { padding: "20px 30px", background: "#fff", borderTop: "1px solid #e2e8f0" },
  inputContainer: { display: "flex", background: "#f8fafc", borderRadius: "16px", padding: "8px 12px", border: "1px solid #e2e8f0", alignItems: "center" },
  input: { flex: 1, padding: "12px", border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "#1e293b" },
  sendBtn: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.2s",
  },
  empty: { margin: "auto", textAlign: "center", color: "#64748b", maxWidth: "300px" },
  initBtn: { marginTop: "20px", padding: "10px 20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", fontWeight: "700", color: "#6366f1" },
};

export default Chat;