import React, { useState, useContext, useEffect } from "react";
import styles from "./MobileNavbar.module.css";
import logo from "../../../assets/Logos/MainLogo.svg";

import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaHome,
  FaServicestack,
  FaSearch,
  FaRobot,
  FaSignOutAlt,
  FaGlobe,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { AuthContext } from "../../../Conetxt/AuthContext/AuthContext";
import { useTranslation } from "react-i18next";

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  // sync language like main navbar
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button className={styles.floatingBtn} onClick={() => setOpen(true)}>
          <FaBars />
        </button>
      )}

      {/* Overlay */}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={() => setOpen(false)}>
          <FaTimes />
        </button>

        {/* Menu */}
        <ul>
          <li>
            <Link to="/dashboard/home" onClick={() => setOpen(false)}>
              <FaHome /> <span>{t("home")}</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/services" onClick={() => setOpen(false)}>
              <FaServicestack /> <span>{t("services")}</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/search" onClick={() => setOpen(false)}>
              <FaSearch /> <span>{t("search")}</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/ai-chat" onClick={() => setOpen(false)}>
              <FaRobot /> <span>{t("aiChat")}</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/user-profile" onClick={() => setOpen(false)}>
              <FaUserCircle /> <span>{t("profile")}</span>
            </Link>
          </li>

          {/* Language switch */}
          <li>
            <button onClick={toggleLanguage} className={styles.langBtn}>
              <FaGlobe /> <span>{i18n.language === "ar" ? "EN" : "ع"}</span>
            </button>
          </li>

          {/* Logout */}
          <li>
            <button onClick={logout}>
              <FaSignOutAlt /> <span>{t("logout")}</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
