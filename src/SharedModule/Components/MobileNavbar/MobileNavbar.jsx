import React, { useState, useContext } from "react";
import styles from "./MobileNavbar.module.css";
import logo from '../../../assets/Logos/MainLogo.svg'
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaHome,
  FaServicestack,
  FaSearch,
  FaRobot,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Conetxt/AuthContext/AuthContext";

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  return (
    <>
      {/* Floating Button (فوق يمين) */}
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
              <FaHome /> <span>Home</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/services" onClick={() => setOpen(false)}>
              <FaServicestack /> <span>Services</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/search" onClick={() => setOpen(false)}>
              <FaSearch /> <span>Search</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/ai-chat" onClick={() => setOpen(false)}>
              <FaRobot /> <span>AI Chat</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/user-profile" onClick={() => setOpen(false)}>
              <FaUserCircle /> <span>Profile</span>
            </Link>
          </li>

          <li>
            <button onClick={logout}>
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
