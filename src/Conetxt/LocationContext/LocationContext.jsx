import React, { createContext, useEffect, useState } from "react";

export const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  function userLocation() {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      function (err) {
        console.log(err.message);
      },
    );
  }

  useEffect(() => {
    userLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ lat, lng }}>
      {children}
    </LocationContext.Provider>
  );
}
