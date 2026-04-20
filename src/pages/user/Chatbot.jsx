import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you use react-router
import { sendChatMessage } from "../../services/api";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;
    setChat((prev) => [...prev, { sender: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await sendChatMessage(userMessage);
      const botReply = res.data?.reply || "I'm not sure about that. Can you rephrase? 🚗";
      setChat((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      setChat((prev) => [...prev, { sender: "bot", text: "Connection error. Please try again. ❌" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={pageContainer}>
      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes roadMove {
            from { background-position: 0px; }
            to { background-position: -100px; }
          }
          @keyframes driveBy {
            from { left: -150px; }
            to { left: 110%; }
          }
          .message-pop { animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
          .road-line { 
            position: absolute; bottom: 0; width: 100%; height: 60px; 
            background: #0f172a; border-top: 4px solid #334155;
            background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.1) 50%);
            background-size: 80px 4px; background-repeat: repeat-x;
            background-position: center bottom 25px; animation: roadMove 0.8s linear infinite;
          }
          .bg-car { position: absolute; bottom: 22px; font-size: 40px; animation: driveBy 12s linear infinite; opacity: 0.8; }
          .back-btn:hover { background: rgba(255,255,255,0.2) !important; transform: translateX(-3px); }
          .send-btn:hover:not(:disabled) { transform: scale(1.1); background: #4f46e5 !important; }
          .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        `}
      </style>

      {/* Decorative Background */}
      <div className="road-line"></div>
      <div className="bg-car">🏎️</div>

      <div style={containerCard}>
        {/* HEADER */}
        <div style={header}>
          <button 
            onClick={() => navigate("/")} 
            className="back-btn"
            style={backButtonStyle}
          >
            ←
          </button>
          <div style={avatarCircle}>🤖</div>
          <div style={{ textAlign: "left", flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#fff", fontWeight: "600" }}>AI Car Assistant</h3>
            <div style={{ fontSize: "11px", color: "#c7d2fe", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={onlineStatus}></span> Online • High Performance
            </div>
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div style={chatBox}>
          {chat.length === 0 && (
            <div style={emptyState}>
              <div style={{ fontSize: "50px", marginBottom: "15px" }}>🏎️</div>
              <p style={{ margin: "0 0 5px 0", fontWeight: "600", color: "#1e293b" }}>Welcome to the Garage!</p>
              <p style={{ fontSize: "13px", color: "#64748b", maxWidth: "200px" }}>
                Ask me about car models, pricing, or technical specs.
              </p>
            </div>
          )}

          {chat.map((msg, index) => (
            <div
              key={index}
              className="message-pop"
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: msg.sender === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                  background: msg.sender === "user" ? "#6366f1" : "#ffffff",
                  color: msg.sender === "user" ? "#fff" : "#334155",
                  maxWidth: "80%",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  border: msg.sender === "user" ? "none" : "1px solid #e2e8f0"
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
              <div className="loading-dots" style={{ color: "#6366f1", fontWeight: "600", fontSize: "12px" }}>
                Revving the engine...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div style={inputSection}>
          <div style={inputContainer}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your dream car..."
              style={inputStyle}
              disabled={loading}
            />
            <button 
              onClick={sendMessage} 
              style={sendBtn} 
              className="send-btn"
              disabled={loading || !message.trim()}
            >
              <span style={{ transform: "rotate(-45deg)", display: "block", marginLeft: "3px" }}>➤</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎨 ENHANCED STYLES
const pageContainer = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top left, #f8fafc, #e2e8f0)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const containerCard = {
  width: "100%",
  maxWidth: "420px",
  height: "600px",
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: "28px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  zIndex: 10,
  margin: "20px",
};

const header = {
  background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const backButtonStyle = {
  background: "rgba(255, 255, 255, 0.15)",
  border: "none",
  color: "white",
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "0.2s all",
};

const onlineStatus = {
  width: "8px",
  height: "8px",
  background: "#10b981",
  borderRadius: "50%",
  display: "inline-block",
};

const avatarCircle = {
  width: "44px",
  height: "44px",
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
};

const chatBox = {
  flex: 1,
  padding: "24px",
  overflowY: "auto",
  background: "transparent",
  display: "flex",
  flexDirection: "column",
};

const emptyState = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#94a3b8",
  textAlign: "center",
};

const inputSection = {
  padding: "20px",
  background: "#fff",
  borderTop: "1px solid #f1f5f9",
};

const inputContainer = {
  display: "flex",
  background: "#f1f5f9",
  borderRadius: "16px",
  padding: "6px 6px 6px 16px",
  alignItems: "center",
  border: "1px solid #e2e8f0",
};

const inputStyle = {
  flex: 1,
  border: "none",
  background: "transparent",
  outline: "none",
  fontSize: "15px",
  padding: "10px 0",
  color: "#1e293b",
};

const sendBtn = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "#6366f1",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

export default Chatbot;