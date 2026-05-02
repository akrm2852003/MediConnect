import React from "react";
import styles from "./AiSidebar.module.css";
import { Link } from "react-router-dom";
import { FaTimes, FaRobot, FaPlus, FaCommentMedical } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function AiSidebar({ userSessions, onClose }) {
  const { t } = useTranslation();

  return (
    <div className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>✦</span>
          <span className={styles.brandName}>MediConnect</span>
        </div>

        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={t("closeSidebar")}
        >
          <FaTimes />
        </button>
      </div>

      {/* New Chat */}
      <Link
        to="/dashboard/ai-chat"
        className={styles.newChatBtn}
        onClick={onClose}
      >
        <FaPlus className={styles.newChatIcon} />
        <span>{t("newConversation")}</span>
      </Link>

      {/* Sessions */}
      <div className={styles.sessionsLabel}>{t("recentChats")}</div>

      <ul className={styles.sessionList}>
        {userSessions.length === 0 && (
          <li className={styles.emptyItem}>
            <FaCommentMedical className={styles.emptyIcon} />
            <span>{t("noSessions")}</span>
          </li>
        )}

        {userSessions.map((session) => {
          const preview =
            session?.messages?.[0]?.content
              ?.split(" ")
              ?.slice(0, 4)
              ?.join(" ") || t("chatSession");

          return (
            <li key={session.id}>
              <Link
                to={`/dashboard/ai-chat/${session.id}`}
                className={styles.sessionLink}
                onClick={onClose}
              >
                <span className={styles.sessionIconWrap}>
                  <FaRobot className={styles.sessionIcon} />
                </span>

                <span className={styles.sessionText}>{preview}…</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.footerDot} />
        {t("aiFooter")}
      </div>
    </div>
  );
}
