import React, { useState } from "react";
import styles from "./AiSidebar.module.css";
import { Link } from "react-router-dom";
import { FaTimes, FaRobot, FaPlus, FaCommentMedical } from "react-icons/fa";

export default function AiSidebar({ userSessions, onClose }) {
  return (
    <div className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>✦</span>
          <span className={styles.brandName}>MediConnect</span>
        </div>

        {/* Close button — shown on mobile via CSS */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      </div>

      {/* New Chat CTA */}
      <Link
        to="/dashboard/ai-chat"
        className={styles.newChatBtn}
        onClick={onClose}
      >
        <FaPlus className={styles.newChatIcon} />
        <span>New Conversation</span>
      </Link>

      {/* Sessions list */}
      <div className={styles.sessionsLabel}>Recent Chats</div>

      <ul className={styles.sessionList}>
        {userSessions.length === 0 && (
          <li className={styles.emptyItem}>
            <FaCommentMedical className={styles.emptyIcon} />
            <span>No sessions yet</span>
          </li>
        )}

        {userSessions.map((session) => {
          const preview =
            session?.messages?.[0]?.content
              ?.split(" ")
              ?.slice(0, 4)
              ?.join(" ") || "Chat Session";

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
        AI-powered medical assistant
      </div>
    </div>
  );
}
