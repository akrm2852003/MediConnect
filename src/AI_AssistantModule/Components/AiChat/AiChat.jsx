import React, { useContext, useEffect, useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import styles from "./AiChat.module.css";
import AiSidebar from "../AiSidebar/AiSidebar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LocationContext } from "../../../Conetxt/LocationContext/LocationContext";

export default function AiChat() {
  const [userSessions, setUserSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { lat, lng } = useContext(LocationContext);
  const { id } = useParams();

  async function getAiChats() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://mediconnect-api.online/api/ai/my-sessions`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUserSessions(response.data.data.sessions);
    } catch (error) {
      console.log("status:", error.response?.status);
      console.log("data:", error.response?.data);
    }
  }

  useEffect(() => {
    if (!id) {
      setMessages([]);
      return;
    }
  }, [id]);

  useEffect(() => {
    getAiChats();
  }, []);

  useEffect(() => {
    var currentSession = userSessions.find((session) => session.id === id);
    if (!currentSession || !currentSession.messages) return;

    var formattedMessages = currentSession.messages.map((msg) => ({
      message: msg.content,
      sender: msg.role === "user" ? "user" : "bot",
      direction: msg.role === "user" ? "outgoing" : "incoming",
    }));

    setMessages(formattedMessages);
  }, [id]);

  async function handleSend(text, id) {
    const token = localStorage.getItem("token");

    const userMessage = {
      message: text,
      sender: "user",
      direction: "outgoing",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post(
        `https://mediconnect-api.online/api/ai/unified`,
        { session_id: id, answer: text },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const botMessage = {
        message: response.data.data.next_question,
        sender: "bot",
        direction: "incoming",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log("status:", error.response?.status);
      console.log("data:", error.response?.data);
    }
  }

  async function handleNewChat(text, lat, lng) {
    const token = localStorage.getItem("token");

    const userMessage = {
      message: text,
      sender: "user",
      direction: "outgoing",
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        `https://mediconnect-api.online/api/ai/unified`,
        { question: text, latitude: lat, longitude: lng },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const newSessionId = response.data.data.session_id;

      const botMessage = {
        message: response.data.data.next_question,
        sender: "bot",
        direction: "incoming",
      };

      setMessages((prev) => [...prev, botMessage]);
      window.location.href = `/dashboard/ai-chat/${newSessionId}`;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <AiSidebar
          userSessions={userSessions}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main chat area */}
      <main className={styles.chatMain}>
        {/* Mobile floating button to open sidebar */}
        <button
          className={styles.mobileSidebarToggle}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="16" y2="18" />
          </svg>
        </button>

        {/* Chat container */}
        <div className={styles.chatContainer}>
          <MainContainer className={styles.mainContainer}>
            <ChatContainer>
              <MessageList className={styles.messageList}>
                {messages.length === 0 && (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>✦</div>
                    <h2 className={styles.emptyTitle}>
                      How can I help you today?
                    </h2>
                    <p className={styles.emptySubtitle}>
                      Describe your symptoms or ask a medical question to get
                      started.
                    </p>
                  </div>
                )}
                {messages.map((msg, index) => (
                  <Message
                    key={index}
                    model={{
                      message: msg.message,
                      sender: msg.sender,
                      direction: msg.direction,
                      senderName: msg.sender,
                    }}
                  />
                ))}
              </MessageList>

              <MessageInput
                placeholder="Ask about symptoms, medications, or health advice…"
                onSend={(text) => {
                  if (id) {
                    handleSend(text, id);
                  } else {
                    handleNewChat(text, lat, lng);
                  }
                }}
                className={styles.messageInput}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </main>
    </div>
  );
}
