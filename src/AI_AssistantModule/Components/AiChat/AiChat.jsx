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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LocationContext } from "../../../Conetxt/LocationContext/LocationContext";

// ─── Clinic Bottom Sheet ──────────────────────────────────────────────────────
function ClinicBottomSheet({ clinics, subType, onClose }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = clinics.filter((c) => {
    if (filter === "available") return c.bookingEnabled;
    return true;
  });

  const visibleClinics = expanded ? filtered : filtered.slice(0, 4);

  const colors = [
    { bg: "#E1F5EE", color: "#0F6E56" },
    { bg: "#E6F1FB", color: "#185FA5" },
    { bg: "#EEEDFE", color: "#534AB7" },
    { bg: "#FAEEDA", color: "#854F0B" },
    { bg: "#FAECE7", color: "#993C1D" },
  ];

  function getInitials(name) {
    const clean = name
      .replace(/^د\.?\s*/, "")
      .trim()
      .split(" ");
    return clean
      .slice(0, 2)
      .map((p) => p[0])
      .join("");
  }

  return (
    <div className={styles.bsOverlay}>
      <div className={styles.bsSheet}>
        {/* Handle + header */}
        <div className={styles.bsTop}>
          <div className={styles.bsHandle} />
          <div className={styles.bsHeaderRow}>
            <div>
              <span className={styles.bsTitle}>
                {filtered.length} عيادة قريبة منك
              </span>
              {subType && (
                <span className={styles.bsSubType}> · {subType}</span>
              )}
            </div>
            <div className={styles.bsHeaderRight}>
              <div className={styles.bsFilters}>
                <button
                  className={`${styles.bsFilter} ${filter === "all" ? styles.bsFilterActive : ""}`}
                  onClick={() => setFilter("all")}
                >
                  الكل
                </button>
                <button
                  className={`${styles.bsFilter} ${filter === "available" ? styles.bsFilterActive : ""}`}
                  onClick={() => setFilter("available")}
                >
                  المتاح فقط
                </button>
              </div>
              <button className={styles.bsClose} onClick={onClose}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className={styles.bsCards}>
          {visibleClinics.map((clinic, i) => {
            const palette = colors[i % colors.length];
            const distKm =
              clinic.distance != null
                ? `${clinic.distance.toFixed(1)} كم`
                : null;
            const phone = clinic.phoneNumbers?.[0];
            const available = clinic.bookingEnabled;

            return (
              <div key={clinic.id} className={styles.bsCard}>
                <div
                  className={styles.bsCardAvatar}
                  style={{ background: palette.bg, color: palette.color }}
                >
                  {getInitials(clinic.name)}
                </div>
                <div className={styles.bsCardInfo}>
                  <div className={styles.bsCardName}>{clinic.name}</div>
                  <div className={styles.bsCardSub}>
                    {clinic.area && (
                      <>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 16 16"
                          fill="none"
                          style={{ flexShrink: 0 }}
                        >
                          <circle
                            cx="8"
                            cy="7"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M8 2C5.24 2 3 4.24 3 7c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                          />
                        </svg>
                        {clinic.area}
                        {distKm && ` · ${distKm}`}
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.bsCardRight}>
                  <span
                    className={
                      available ? styles.bsAvailGreen : styles.bsAvailGray
                    }
                  >
                    ● {available ? "متاح" : "غير متاح"}
                  </span>
                  <div className={styles.bsCardBtns}>
                    {phone && (
                      <a href={`tel:${phone}`} className={styles.bsCallBtn}>
                        اتصل
                      </a>
                    )}
                    {clinic.detailUrl && (
                      <a
                        href={clinic.detailUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.bsDetailBtn}
                      >
                        تفاصيل
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more */}
        {filtered.length > 4 && (
          <button
            className={styles.bsShowMore}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "عرض أقل ▲" : `عرض ${filtered.length - 4} عيادة أخرى ▼`}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AiChat() {
  const [userSessions, setUserSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clinicSheet, setClinicSheet] = useState(null); // { clinics, subType }

  const navigate = useNavigate();
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
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        `https://mediconnect-api.online/api/ai/unified`,
        { session_id: id, answer: text },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data.data;
      const messagesToAdd = [];
      const mainMessage = data.next_question || data.final_diagnosis;

      if (mainMessage) {
        messagesToAdd.push({
          message: mainMessage,
          sender: "bot",
          direction: "incoming",
        });
      }

      if (!mainMessage) {
        messagesToAdd.push({
          message: "تم انتهاء المحادثة",
          sender: "bot",
          direction: "incoming",
        });
      }

      setMessages((prev) => [...prev, ...messagesToAdd]);

      // ─── لو في عيادات → افتح الـ bottom sheet ───
      if (data.nearby_places && data.nearby_places.length > 0) {
        setClinicSheet({
          clinics: data.nearby_places,
          subType: data.subTypeAr || data.subType || "",
        });
      }
      console.log(response);
      
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

      const data = response.data.data;
      const newSessionId = data.session_id;
      const botMessage = {
        message: data.next_question,
        sender: "bot",
        direction: "incoming",
      };

      setMessages((prev) => [...prev, botMessage]);
      navigate(`/dashboard/ai-chat/${newSessionId}`);
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

        {/* Chat */}
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
                      sender: msg.sender,
                      direction: msg.direction,
                      senderName: msg.sender,
                    }}
                  >
                    <Message.CustomContent>
                      <div dangerouslySetInnerHTML={{ __html: msg.message }} />
                    </Message.CustomContent>
                  </Message>
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
                className="flex justify-between items-center w-full md:w-3/5 mx-auto mb-6 px-5 py-3 bg-white border border-gray-300 rounded-full shadow-sm text-sm placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none transition-all duration-200"
              />
            </ChatContainer>
          </MainContainer>
        </div>

        {/* ─── Full-width Bottom Sheet ─── */}
        {clinicSheet && (
          <ClinicBottomSheet
            clinics={clinicSheet.clinics}
            subType={clinicSheet.subType}
            onClose={() => setClinicSheet(null)}
          />
        )}
      </main>
    </div>
  );
}
