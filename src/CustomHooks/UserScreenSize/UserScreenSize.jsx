import { useState, useEffect } from "react";

export default function useScreenSize() {
  const getSize = () => {
    const width = window.innerWidth;

    return {
      isMobileOrTablet: width <= 1024,
      isDesktop: width > 1024,
    };
  };

  const [screen, setScreen] = useState(getSize);

  useEffect(() => {
    const handleResize = () => {
      setScreen(getSize());
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screen;
}
