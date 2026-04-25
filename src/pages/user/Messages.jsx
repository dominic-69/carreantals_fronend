import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import API from "../../services/api";

function Messages() {
  const query = new URLSearchParams(useLocation().search);
  const chatIdFromURL = query.get("chat_id");

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(chatIdFromURL);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const username = localStorage.getItem("username");

  // Load Chat List
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await API.get("chat/userchat/");
        setChats(res.data);
      } catch (err) { console.error(err); }
    };
    fetchChats();
  }, []);

  // Load Messages
  useEffect(() => {
    if (!activeChat) return;
    const fetchMessages = async () => {
      try {
        const res = await API.get(`chat/userchat/${activeChat}/messages/`);
        setMessages(res.data);
      } catch (err) { console.error(err); }
    };
    fetchMessages();
  }, [activeChat]);

  // Socket Connection
  useEffect(() => {
    if (!activeChat) return;
    if (socketRef.current) socketRef.current.close();
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/userchat/${activeChat}/`);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, { text: data.message, sender: data.sender }]);
    };
    socketRef.current = socket;
    return () => socket.close();
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socketRef.current.send(JSON.stringify({ message: input, sender: username }));
    setInput("");
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.title}>Chats</h2>
        </div>
        <div style={styles.chatList}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              style={{
                ...styles.chatItem,
                background: activeChat === chat.id.toString() ? "#f0f2f5" : "transparent",
              }}
              onClick={() => setActiveChat(chat.id.toString())}
            >
              <div style={styles.avatar}>{chat.other_user_name[0].toUpperCase()}</div>
              <div style={styles.chatInfo}>
                <span style={styles.chatName}>{chat.other_user_name}</span>
                <p style={styles.lastMsg}>{chat.last_message || "Start a conversation"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatArea}>
        {activeChat ? (
          <>
            <div style={styles.header}>
              <div style={styles.avatarSmall}>
                {chats.find(c => c.id.toString() === activeChat)?.other_user_name[0].toUpperCase()}
              </div>
              <div style={{ marginLeft: "12px" }}>
                <div style={styles.headerName}>
                  {chats.find(c => c.id.toString() === activeChat)?.other_user_name}
                </div>
              </div>
            </div>

            <div style={styles.chatBox}>
              {messages.map((msg, i) => {
                const isMe = msg.sender === username;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMe ? "flex-end" : "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    {/* SENDER NAME */}
                    <span style={styles.senderLabel}>
                      {isMe ? "You" : msg.sender}
                    </span>
                    
                    <div
                      style={{
                        ...styles.bubble,
                        background: isMe ? "#d9fdd3" : "#fff",
                        borderRadius: isMe ? "12px 0px 12px 12px" : "0px 12px 12px 12px",
                      }}
                    >
                      <div style={styles.messageText}>{msg.text}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}></div>
            </div>

            <div style={styles.inputArea}>
              <div style={styles.inputContainer}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  style={styles.input}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage} style={styles.sendBtn}>➤</button>
              </div>
            </div>
          </>
        ) : (
          <div style={styles.empty}>Select a chat to see messages</div>
        )}
      </div>
    </div>
  );
}

export default Messages;

const styles = {
  container: { display: "flex", height: "100vh", background: "#f0f2f5", fontFamily: "Segoe UI, Tahoma, sans-serif" },
  sidebar: { width: "350px", background: "#fff", borderRight: "1px solid #ddd", display: "flex", flexDirection: "column" },
  sidebarHeader: { padding: "20px", borderBottom: "1px solid #eee" },
  title: { margin: 0, fontSize: "20px" },
  chatList: { flex: 1, overflowY: "auto" },
  chatItem: { display: "flex", padding: "15px", cursor: "pointer", borderBottom: "1px solid #f9f9f9", alignItems: "center" },
  avatar: { width: "45px", height: "45px", borderRadius: "50%", background: "#00a884", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", marginRight: "12px" },
  chatInfo: { flex: 1 },
  chatName: { fontWeight: "600", fontSize: "16px" },
  lastMsg: { fontSize: "13px", color: "#666", margin: "4px 0 0 0" },
  chatArea: { flex: 1, display: "flex", flexDirection: "column", background: "#e5ddd5" },
  header: { padding: "10px 20px", background: "#f0f2f5", display: "flex", alignItems: "center", borderBottom: "1px solid #ddd" },
  headerName: { fontWeight: "600" },
  avatarSmall: { width: "35px", height: "35px", borderRadius: "50%", background: "#00a884", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" },
  chatBox: { flex: 1, padding: "20px", overflowY: "auto" },
  senderLabel: { fontSize: "11px", color: "#666", marginBottom: "2px", marginLeft: "4px", marginRight: "4px", fontWeight: "500" },
  bubble: { padding: "10px 15px", maxWidth: "70%", boxShadow: "0 1px 1px rgba(0,0,0,0.1)" },
  messageText: { fontSize: "14.5px", color: "#111" },
  inputArea: { padding: "10px 20px", background: "#f0f2f5" },
  inputContainer: { display: "flex", background: "#fff", borderRadius: "25px", padding: "5px 15px", alignItems: "center" },
  input: { flex: 1, border: "none", outline: "none", padding: "10px", fontSize: "15px" },
  sendBtn: { border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "#00a884" },
  empty: { margin: "auto", color: "#888" },
};