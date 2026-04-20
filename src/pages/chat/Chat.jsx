import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";

const Chat = () => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  // Get current user safely
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    startChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startChat = async () => {
    try {
      const res = await API.post("chat/start/");
      setChatId(res.data.chat_id);
      fetchMessages(res.data.chat_id);
    } catch (err) {
      console.error("Failed to start chat", err);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await API.get(`chat/${id}/messages/`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    if (!chatId) return;
    const interval = setInterval(() => {
      fetchMessages(chatId);
    }, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await API.post(`chat/${chatId}/send/`, { text });
      setText("");
      fetchMessages(chatId);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // --- Styles ---
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)", // Cool Light Blue Gradient
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "20px"
  };

  const chatCard = {
    width: "100%",
    maxWidth: "550px",
    height: "75vh",
    backgroundColor: "#f0f4f8", // Matte Cool Light Grey-Blue
    borderRadius: "28px",
    boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff", // Soft Shadow
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.4)"
  };

  const headerStyle = {
    padding: "20px 25px",
    background: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };

  const inputAreaStyle = {
    padding: "20px",
    background: "rgba(255, 255, 255, 0.5)",
    display: "flex",
    gap: "12px",
    alignItems: "center"
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .message-enter {
            animation: slideUp 0.4s ease-out forwards;
          }
          .custom-scroll::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 10px;
          }
          .send-btn:hover {
            background: #4a90e2 !important;
            transform: scale(1.05);
          }
        `}
      </style>

      <div style={chatCard}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h3 style={{ margin: 0, color: "#2d3748", fontSize: "18px" }}>Support Assistant</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <div style={{ width: "8px", height: "8px", background: "#48bb78", borderRadius: "50%" }}></div>
              <span style={{ fontSize: "12px", color: "#718096" }}>Active Now</span>
            </div>
          </div>
          <span style={{ fontSize: "20px" }}>💬</span>
        </div>

        {/* Messages */}
        <div 
          className="custom-scroll"
          ref={scrollRef} 
          style={{ 
            flex: 1, 
            padding: "25px", 
            overflowY: "auto", 
            display: "flex", 
            flexDirection: "column", 
            gap: "16px" 
          }}
        >
          {messages.length === 0 && (
            <p style={{ textAlign: "center", color: "#a0aec0", fontSize: "14px", marginTop: "20px" }}>
              Starting a secure conversation...
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender === currentUser.id;
            return (
              <div
                key={msg.id}
                className="message-enter"
                style={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                  padding: "12px 18px",
                  borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  background: isMe ? "#5a67d8" : "#ffffff", // Indigo for user, White for support
                  color: isMe ? "#ffffff" : "#2d3748",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  position: "relative"
                }}
              >
                {!isMe && (
                  <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px", color: "#5a67d8" }}>
                    {msg.sender_name}
                  </div>
                )}
                {msg.text}
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div style={inputAreaStyle}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: "15px",
              border: "1px solid rgba(0,0,0,0.08)",
              outline: "none",
              fontSize: "14px",
              background: "#ffffff",
              color: "#2d3748",
              boxShadow: "inset 2px 2px 5px #f0f4f8"
            }}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            style={{
              background: "#5a67d8",
              color: "white",
              border: "none",
              width: "48px",
              height: "48px",
              borderRadius: "15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              fontSize: "18px"
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;