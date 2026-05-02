import React, { useContext, useEffect } from "react";
import styles from "./Navbar.module.css";
import logo from "../../../assets/Logos/MainLogo.svg";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Conetxt/AuthContext/AuthContext";
import { FaUserCircle, FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
  }, []);
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* LEFT - Logo */}
        <div className={styles.left}>
          <Link to={"/dashboard"}>
            <div className={styles.logoSection}>
              <img src={logo} className={styles.logo} alt="logo" />
              <span className={styles.brand}>MediConnect</span>
            </div>
          </Link>
        </div>

        {/* CENTER - Menu */}
        <div className={styles.center}>
          <ul className={styles.menu}>
            <li>
              <Link to="/dashboard/home">{t("home")}</Link>
            </li>
            <li>
              <Link to="/dashboard/services">{t("services")}</Link>
            </li>
            <li>
              <Link to="/dashboard/search">{t("search")}</Link>
            </li>
            <li>
              <Link to="/dashboard/ai-chat">{t("aiChat")}</Link>
            </li>
          </ul>
        </div>

        {/* RIGHT - Actions */}
        <div className={styles.right}>
          {/* Language */}
          <button onClick={toggleLanguage} className={styles.langBtn}>
            <FaGlobe />
            <span>{i18n.language === "ar" ? "EN" : "ع"}</span>
          </button>

          {/* User */}
          <Link to="/dashboard/user-profile" className={styles.userIcon}>
            <FaUserCircle />
          </Link>

          {/* Logout */}
          <button onClick={logout} className={styles.btn}>
            {t("logout")}
          </button>
        </div>
      </div>
    </nav>
  );
}
