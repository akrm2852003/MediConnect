import React, { useContext } from "react";
import styles from "./Navbar.module.css";
import logo from "../../../assets/Logos/MainLogo.svg";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Conetxt/AuthContext/AuthContext";
import { FaUserCircle } from "react-icons/fa";


export default function Navbar() {
    let { logout } = useContext(AuthContext);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to={"/dashboard"}>
          <div className={styles.logoSection}>
            <img src={logo} className={styles.logo} alt="logo" />
            <span className={styles.brand}>MediConnect</span>
          </div>
        </Link>

        {/* Menu */}
        <ul className={styles.menu}>
          <li>
            <Link to="/dashboard/home">Home</Link>
          </li>
          <li>
            <Link to="/dashboard/services">Services</Link>
          </li>
          <li>
            <Link to="/dashboard/search">Search</Link>
          </li>
          <li>
            <Link to="/dashboard/ai-chat">Ai Chat</Link>
          </li>
        </ul>

        {/* User Icon */}
        <Link to="/dashboard/user-profile" className={styles.userIcon}>
          <FaUserCircle />
        </Link>

        {/* Logout */}
        <button onClick={logout} className={styles.btn}>
          Logout
        </button>
      </div>
    </nav>
  );
}
