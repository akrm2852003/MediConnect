import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import styles from "./Services.module.css";

// ======================
// 🔥 Fix Leaflet Default Icons
// ======================
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ======================
// تحريك الخريطة
// ======================
function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);

  return null;
}

// ======================
// Component
// ======================
export default function Map({ data, lat, lng }) {
  const defaultCenter = [31.2784, 30.0135];

  const [center, setCenter] = useState(
    lat && lng ? [Number(lat), Number(lng)] : defaultCenter,
  );

  useEffect(() => {
    if (data && data.length > 0) {
      const firstValid = data.find((item) => item.activeLat && item.activeLng);

      if (firstValid) {
        setCenter([Number(firstValid.activeLat), Number(firstValid.activeLng)]);
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
          zIndex: 1,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ChangeView center={center} />

        {data &&
          data
            .filter((item) => item.activeLat && item.activeLng)
            .map((item) => (
              <Marker
                key={item.id || item.name}
                position={[Number(item.activeLat), Number(item.activeLng)]}
              >
                <Popup>
                  <h3>{item.name}</h3>
                  <p>{item.area}</p>
                  <p>{item.phoneNumbers?.[0]}</p>
                </Popup>
              </Marker>
            ))}
      </MapContainer>
    </div>
  );
}
