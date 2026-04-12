import React from "react";
import styles from "./Navbar.module.css";
import logo from "../../../assets/Logos/MainLogo.svg";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <img src={logo} className={styles.logo} alt="logo" />
          <span className={styles.brand}>MediConnect</span>
        </div>

        {/* Menu */}
        <ul className={styles.menu}>
          <li>
            <Link to="/dashboard/home">Home</Link>
          </li>
          <li>
            <Link to="/dashboard/services">Services</Link>
          </li>
          <li>
            <Link to="/dashboard/details">Details</Link>
          </li>
          <li>
            <Link to="/dashboard/blogs">Blogs</Link>
          </li>
        </ul>

        {/* Button */}
        <Link to={"/register"} className={`${styles.btn} text-xl font-extrabold `}>
          Sign in
        </Link>
      </div>
    </nav>
  );
}
