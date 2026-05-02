import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import MobileNavbar from "../MobileNavbar/MobileNavbar";
import useScreenSize from "../../../CustomHooks/UserScreenSize/UserScreenSize";
import FloatingAiButton from "./FloatingAiButton";

export default function MasterLayout() {
  const { isMobileOrTablet } = useScreenSize();

  return (
    <>
      {isMobileOrTablet ? <MobileNavbar /> : <Navbar />}

      <div>
        <Outlet />
      </div>

      <FloatingAiButton />
    </>
  );
}
