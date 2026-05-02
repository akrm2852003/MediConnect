import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import styles from "./Services.module.css";
import { useTranslation } from "react-i18next";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userIcon = new L.DivIcon({
  className: "user-pin-marker",
  html: `
    <div class="pin-wrapper">
      <div class="pin-glow"></div>
      <div class="pin-shape">
        <div class="pin-dot"></div>
      </div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) map.setView(center, 15);
  }, [center, map]);

  return null;
}

export default function Map({ data, lat, lng }) {
  const { t } = useTranslation();

  const defaultCenter = [31.2784, 30.0135];

  const [center, setCenter] = useState(
    lat && lng ? [Number(lat), Number(lng)] : defaultCenter,
  );

  useEffect(() => {
    if (data?.length) {
      const first = data.find((item) => item.activeLat && item.activeLng);

      if (first) {
        setCenter([Number(first.activeLat), Number(first.activeLng)]);
      }
    }
  }, [data]);

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={center}
        zoom={15}
        style={{
          height: "700px",
          width: "100%",
          borderRadius: "10px",
          zIndex: 0,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ChangeView center={center} />

        {/* 👤 User Location */}
        {lat && lng && (
          <Marker position={[Number(lat), Number(lng)]} icon={userIcon}>
            <Popup>
              <strong style={{ color: "#EF4444" }}>
                {t("map.youAreHere")} 📍
              </strong>
            </Popup>
          </Marker>
        )}

        {/* 📍 Data Markers */}
        {data &&
          data
            .filter((item) => item.activeLat && item.activeLng)
            .map((item) => (
              <Marker
                key={item.id || item.name}
                position={[Number(item.activeLat), Number(item.activeLng)]}
              >
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <h3>{item.name}</h3>
                    <p>{item.area}</p>
                    <p>{item.phoneNumbers?.[0]}</p>

                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${item.activeLat},${item.activeLng}`;
                        window.open(url, "_blank");
                      }}
                      style={{
                        marginTop: "8px",
                        padding: "6px 12px",
                        background: "#EF4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      {t("map.openRoute")} 🧭
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
      </MapContainer>

      <style>{`
        .pin-wrapper {
          position: relative;
          width: 30px;
          height: 30px;
        }

        .pin-shape {
          width: 30px;
          height: 30px;
          background: #ef4444;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          position: relative;
          box-shadow: 0 6px 18px rgba(0,0,0,0.3);
        }

        .pin-dot {
          position: absolute;
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .pin-glow {
          position: absolute;
          width: 30px;
          height: 30px;
          background: rgba(239, 68, 68, 0.4);
          border-radius: 50%;
          animation: pulse 1.3s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(2); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
