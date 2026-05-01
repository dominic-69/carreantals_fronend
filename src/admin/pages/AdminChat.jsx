/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import AdminSidebar from "../components/AdminSidebar";

const AdminChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const ws = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // =========================
  // 🔥 LOAD CHAT LIST
  // =========================
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

  // =========================
  // 🔥 LOAD OLD MESSAGES
  // =========================
  const loadMessages = async (chatId) => {
    setSelectedChat(chatId);
    try {
      const res = await API.get(`chat/${chatId}/messages/`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // 🔥 REALTIME WEBSOCKET
  // =========================
  useEffect(() => {
    if (!selectedChat) return;

    // 🔥 CLOSE OLD CONNECTION
    if (ws.current) ws.current.close();

    // 🔥 OPEN NEW
    ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${selectedChat}/`);

    ws.current.onopen = () => {
      console.log("✅ WS Connected");
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      setMessages((prev) => [
        ...prev,
        {
          text: data.message,
          sender_name: data.sender,
        },
      ]);
    };

    ws.current.onerror = (e) => {
      console.log("❌ WS ERROR", e);
    };

    ws.current.onclose = () => {
      console.log("❌ WS Closed");
    };

    return () => ws.current?.close();
  }, [selectedChat]);

  // =========================
  // 🔥 SEND MESSAGE
  // =========================
  const sendMessage = () => {
    if (!text.trim()) return;

    if (!ws.current || ws.current.readyState !== 1) {
      console.log("❌ WebSocket not connected");
      return;
    }

    ws.current.send(
      JSON.stringify({
        message: text,
      })
    );

    setText("");
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#f8fafc", height: "100vh", fontFamily: "sans-serif" }}>
      <AdminSidebar />

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

        {/* LEFT PANEL */}
        <div style={{
          width: "300px",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff"
        }}>
          <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ margin: 0 }}>Messages</h3>
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
                  gap: "12px",
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
                  {chat.seller_name[0]}
                </div>

                <div>
                  <div style={{ fontWeight: "600" }}>{chat.seller_name}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>Online</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {selectedChat ? (
            <>
              {/* HEADER */}
              <div style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
                <h4>
                  {chats.find(c => c.chat_id === selectedChat)?.seller_name}
                </h4>
              </div>

              {/* MESSAGES */}
              <div style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                {messages.map((msg, i) => {
                  const isMe = msg.sender_name === currentUser.username;

                  return (
                    <div
                      key={i}
                      style={{
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        maxWidth: "70%",
                        padding: "10px 15px",
                        borderRadius: isMe ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                        background: isMe ? "#6366f1" : "#e2e8f0",
                        color: isMe ? "#fff" : "#000"
                      }}
                    >
                      {!isMe && (
                        <div style={{ fontSize: "10px", marginBottom: "5px" }}>
                          {msg.sender_name}
                        </div>
                      )}
                      {msg.text}
                    </div>
                  );
                })}
              </div>

              {/* INPUT */}
              <div style={{ padding: "15px", borderTop: "1px solid #eee" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "20px",
                      border: "1px solid #ccc"
                    }}
                  />

                  <button
                    onClick={sendMessage}
                    style={{
                      background: "#6366f1",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "20px",
                      cursor: "pointer"
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999"
            }}>
              Select a chat
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminChat;