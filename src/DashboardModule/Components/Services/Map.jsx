import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import styles from "./Services.module.css";

// تحريك الخريطة
function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 15); // reset zoom كل مرة
    }
  }, [center, map]);

  return null;
}

export default function Map({ data, lat, lng }) {
  const defaultCenter = [31.2784, 30.0135];

  const [center, setCenter] = useState(
    lat && lng ? [Number(lat), Number(lng)] : defaultCenter,
  );

  // 👇 أهم جزء: كل ما data تتغير نعيد ضبط الخريطة
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

        {/* يتحرك كل مرة center يتغير */}
        <ChangeView center={center} />

        {/* markers بتتحدث تلقائي */}
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
