import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./FloatingAiButton.module.css";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useTranslation } from "react-i18next";

export default function FloatingAiButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  if (location.pathname.startsWith("/dashboard/ai-chat")) {
    return null;
  }

  return (
    <button
      onClick={() => navigate(`/dashboard/ai-chat`)}
      className={styles.aiBtn}
    >
      <span className={styles.icon}>
        <SmartToyIcon style={{ fontSize: 18 }} />
      </span>

      <span className={styles.text}>{t("ai.ask_ai")}</span>
    </button>
  );
}
