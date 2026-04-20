import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "../components/AdminSidebar";

const AdminChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Keep your existing functionality intact
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await API.get("chat/admin/chats/");
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async (chatId) => {
    setSelectedChat(chatId);
    try {
      const res = await API.get(`chat/${chatId}/messages/`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;
    const interval = setInterval(() => {
      loadMessages(selectedChat);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await API.post(`chat/${selectedChat}/send/`, { text });
      setText("");
      loadMessages(selectedChat);
    } catch (err) {
      console.error(err);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ display: "flex", backgroundColor: "#f8fafc", height: "100vh", fontFamily: "sans-serif" }}>
      <AdminSidebar />

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        margin: "20px", 
        backgroundColor: "#fff", 
        borderRadius: "12px", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)", 
        overflow: "hidden",
        border: "1px solid #e2e8f0"
      }}>
        
        {/* LEFT PANEL: Chat List */}
        <div style={{ 
          width: "300px", 
          borderRight: "1px solid #e2e8f0", 
          display: "flex", 
          flexDirection: "column",
          backgroundColor: "#fff"
        }}>
          <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ margin: 0, color: "#1e293b", fontSize: "1.2rem" }}>Messages</h3>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {chats.map((chat) => (
              <div
                key={chat.chat_id}
                onClick={() => loadMessages(chat.chat_id)}
                style={{
                  padding: "15px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "background 0.2s",
                  borderLeft: selectedChat === chat.chat_id ? "4px solid #6366f1" : "4px solid transparent",
                  backgroundColor: selectedChat === chat.chat_id ? "#f5f3ff" : "transparent",
                }}
              >
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "50%", 
                  backgroundColor: "#6366f1", 
                  color: "#fff", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontWeight: "bold"
                }}>
                  {chat.seller_name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: "600", color: "#334155", fontSize: "0.9rem" }}>{chat.seller_name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Online</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Messaging Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fdfdfd" }}>
          {selectedChat ? (
            <>
              {/* Header */}
              <div style={{ padding: "15px 25px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#fff" }}>
                <h4 style={{ margin: 0, color: "#1e293b" }}>
                  {chats.find(c => c.chat_id === selectedChat)?.seller_name}
                </h4>
              </div>

              {/* Chat Box */}
              <div style={{ 
                flex: 1, 
                padding: "20px", 
                overflowY: "auto", 
                display: "flex", 
                flexDirection: "column", 
                gap: "12px" 
              }}>
                {messages.map((msg) => {
                  const isMe = msg.sender === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        maxWidth: "70%",
                        padding: "10px 16px",
                        borderRadius: isMe ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                        backgroundColor: isMe ? "#6366f1" : "#f1f5f9",
                        color: isMe ? "#fff" : "#334155",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                        position: "relative"
                      }}
                    >
                      {!isMe && (
                        <div style={{ fontSize: "0.7rem", fontWeight: "bold", marginBottom: "4px", color: "#64748b" }}>
                          {msg.sender_name}
                        </div>
                      )}
                      <div style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>{msg.text}</div>
                    </div>
                  );
                })}
              </div>

              {/* Input Box */}
              <div style={{ padding: "20px", borderTop: "1px solid #e2e8f0", backgroundColor: "#fff" }}>
                <div style={{ display: "flex", gap: "10px", backgroundColor: "#f8fafc", padding: "8px", borderRadius: "30px", border: "1px solid #e2e8f0" }}>
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Write a message..."
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      padding: "8px 15px",
                      fontSize: "0.9rem"
                    }}
                  />
                  <button 
                    onClick={sendMessage} 
                    style={{
                      backgroundColor: "#6366f1",
                      color: "#fff",
                      border: "none",
                      borderRadius: "20px",
                      padding: "8px 20px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      transition: "opacity 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", flexDirection: "column" }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>💬</div>
              <p>Select a chat to view messages</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminChat;