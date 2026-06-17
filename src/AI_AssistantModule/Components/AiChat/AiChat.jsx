import React, { useContext, useEffect, useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useTranslation } from "react-i18next";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import styles from "./AiChat.module.css";
import AiSidebar from "../AiSidebar/AiSidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LocationContext } from "../../../Conetxt/LocationContext/LocationContext";
import ClinicBottomSheet from "../ClinicBottom/ClinicBottomSheet";

// ─── helpers للـ localStorage ───
const CLINIC_STORAGE_KEY = (sessionId) => `clinicSheet_${sessionId}`;

function saveClinicSheet(sessionId, data) {
  if (!sessionId) return;
  try {
    localStorage.setItem(CLINIC_STORAGE_KEY(sessionId), JSON.stringify(data));
  } catch (_) {}
}

function loadClinicSheet(sessionId) {
  if (!sessionId) return null;
  try {
    const raw = localStorage.getItem(CLINIC_STORAGE_KEY(sessionId));
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function clearClinicSheet(sessionId) {
  if (!sessionId) return;
  try {
    localStorage.removeItem(CLINIC_STORAGE_KEY(sessionId));
  } catch (_) {}
}

// ─── تنظيف المحتوى من المسافات الزيادة ───
function cleanContent(content) {
  if (!content) return "";

  return (
    content
      // مسح المسافات الزيادة في بداية ونهاية كل سطر
      .split("\n")
      .map((line) => line.trim())
      // حذف الأسطر الفارغة المتكررة (أكتر من سطر فاضي واحد)
      .reduce((acc, line) => {
        const lastLine = acc[acc.length - 1];
        if (line === "" && lastLine === "") return acc;
        return [...acc, line];
      }, [])
      // حذف الأسطر الفارغة من الأول والآخر
      .join("\n")
      .trim()
  );
}

export default function AiChat() {
  const [userSessions, setUserSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [clinicSheet, setClinicSheet] = useState(null);
  const [isClinicOpen, setIsClinicOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
const { t } = useTranslation();
  const navigate = useNavigate();
  const { lat, lng } = useContext(LocationContext);
  const { id } = useParams();

  // ─── لما يتغير الـ id، نحمّل العيادات المخزنة لهذا الـ session ───
  useEffect(() => {
    // reset فوري عشان نمسح بيانات الـ session السابق
    setClinicSheet(null);
    setIsClinicOpen(false);

    if (!id) return;

    const saved = loadClinicSheet(id);
    if (saved) {
      setClinicSheet(saved);
      // تبقى مغلقة، المستخدم يفتحها بالزرار
    }
  }, [id]);

  async function getAiChats() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://mediconnect-api.online/api/ai/my-sessions`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUserSessions(response.data.data.sessions);
      console.log(response);
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

    const currentSession = userSessions.find((session) => session.id === id);

    if (!currentSession || !currentSession.messages) {
      setMessages([]);
      return;
    }

    // 👇 هات القديم من localStorage
   const saved = loadClinicSheet(id);

   if (
     currentSession.nearby_places &&
     currentSession.nearby_places.length > 0
   ) {
     setClinicSheet({
       clinics: currentSession.nearby_places,

       // 🔥 أهم سطر
       subType:
         saved?.subType || // الأولوية للـ localStorage
         currentSession.subTypeAr ||
         currentSession.subType ||
         "عيادات مناسبة لحالتك",
     });

     setIsClinicOpen(false);
   }

    const formattedMessages = currentSession.messages.map((msg) => ({
      message: cleanContent(msg.content),
      sender: msg.role === "user" ? "user" : "bot",
      direction: msg.role === "user" ? "outgoing" : "incoming",
    }));

    setMessages(formattedMessages);
  }, [id, userSessions]);
  useEffect(() => {
    getAiChats();
  }, []);

function showMessage(fullText) {
  setMessages((prev) => [
    ...prev,
    {
      message: fullText,
      sender: "bot",
      direction: "incoming",
    },
  ]);
}

async function handleSend(text, sessionId) {
  const token = localStorage.getItem("token");

  const userMessage = {
    message: text,
    sender: "user",
    direction: "outgoing",
  };

  setMessages((prev) => [...prev, userMessage]);

  setIsTyping(true); // 👈 يظهر typing

  try {
    const response = await axios.post(
      `https://mediconnect-api.online/api/ai/unified`,
      { session_id: sessionId, answer: text },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const data = response.data.data;
    const mainMessage = data.next_question || data.final_diagnosis;

    setIsTyping(false); // 👈 يختفي typing فور الرد

    if (mainMessage) {
      showMessage(mainMessage); // 👈 رسالة كاملة مرة واحدة
    } else {
      showMessage("تم انتهاء المحادثة");
    }

    if (data.nearby_places?.length > 0) {
      const sheet = {
        clinics: data.nearby_places,
        subType: data.subTypeAr || data.subType || "",
      };

      setClinicSheet(sheet);
      setIsClinicOpen(true);
      saveClinicSheet(sessionId, sheet);
    }
  } catch (error) {
    setIsTyping(false);
    console.log(error);
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

  setIsTyping(true); // 👈 typing يبدأ

  try {
    const response = await axios.post(
      `https://mediconnect-api.online/api/ai/unified`,
      { question: text, latitude: lat, longitude: lng },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const data = response.data.data;

    setIsTyping(false); // 👈 يختفي

    showMessage(data.next_question); // 👈 رسالة كاملة

    const newSessionId = data.session_id;

    const newSession = {
      id: newSessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
      messages: [
        {
          role: "user",
          content: text,
        },
        {
          role: "ai",
          content: data.next_question,
        },
      ],
    };

    setUserSessions((prev) => [newSession, ...prev]);
    navigate(`/dashboard/ai-chat/${newSessionId}`);

    if (data.nearby_places?.length > 0) {
      const sheet = {
        clinics: data.nearby_places,
        subType: data.subTypeAr || data.subType || "",
      };

      setClinicSheet(sheet);
      setIsClinicOpen(true);
      saveClinicSheet(newSessionId, sheet);
    }
  } catch (error) {
    setIsTyping(false);
    console.log(error);
  }
}

return (
  <div className={`${styles.pageWrapper}  sm:h-screen lg:h-[80vh]`}>
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
              {messages.map((msg, index) => (
                <Message
                  key={index}
                  model={{
                    sender: msg.sender,
                    direction: msg.direction,
                  }}
                >
                  <Message.CustomContent>
                    <div dangerouslySetInnerHTML={{ __html: msg.message }} />
                  </Message.CustomContent>
                </Message>
              ))}

              {/* 👇 typing الوحيد */}
              {isTyping && (
                <Message
                  model={{
                    sender: "bot",
                    direction: "incoming",
                  }}
                >
                  <Message.CustomContent>
                    <div className={styles.typing}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </Message.CustomContent>
                </Message>
              )}
            </MessageList>
            <MessageInput
              placeholder={t("ai.ask_placeholder")}
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

      {/* زرار إعادة فتح العيادات */}
      {clinicSheet && !isClinicOpen && (
        <button
          className={styles.reopenBtn}
          onClick={() => setIsClinicOpen(true)}
        >
          🏥 {t("ai.openClinics")}
        </button>
      )}

      {/* Bottom Sheet */}
      {clinicSheet && isClinicOpen && (
        <ClinicBottomSheet
          clinics={clinicSheet.clinics}
          subType={clinicSheet.subType}
          onClose={() => setIsClinicOpen(false)}
        />
      )}
    </main>
  </div>
);
}
