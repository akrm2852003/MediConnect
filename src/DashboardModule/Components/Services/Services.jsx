import React, { useEffect, useState } from "react";
import img from "../../../assets/images/HeaderImg/Services-Header.png";
import Header from "../../../SharedModule/Components/Header/Header";
import Map from "./Map";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "../Popup/Popup";
import Details from "../Details/Details";
import Slider from "../Slider/Slider";

import {
  FaPills,
  FaHospital,
  FaUserMd,
  FaBrain,
  FaHeart,
  FaEye,
  FaMicroscope,
  FaXRay,
  FaBaby,
  FaBone,
} from "react-icons/fa";

/* =========================
   SUBTYPE CONFIG
========================= */
const subTypeConfig = {
  Pharmacies: {
    icon: FaPills,
    color: "text-emerald-600",
    bg: "from-emerald-100 to-emerald-200",
  },

  Hospitals: {
    icon: FaHospital,
    color: "text-red-600",
    bg: "from-red-100 to-red-200",
  },

  Neurologists: {
    icon: FaBrain,
    color: "text-purple-600",
    bg: "from-purple-100 to-purple-200",
  },

  Cardiologists: {
    icon: FaHeart,
    color: "text-pink-600",
    bg: "from-pink-100 to-pink-200",
  },

  Ophthalmologists: {
    icon: FaEye,
    color: "text-blue-600",
    bg: "from-blue-100 to-blue-200",
  },

  Laboratory: {
    icon: FaMicroscope,
    color: "text-gray-700",
    bg: "from-gray-100 to-gray-200",
  },

  Radiology: {
    icon: FaXRay,
    color: "text-indigo-600",
    bg: "from-indigo-100 to-indigo-200",
  },

  Pediatricians: {
    icon: FaBaby,
    color: "text-sky-600",
    bg: "from-sky-100 to-sky-200",
  },

  Orthopedic: {
    icon: FaBone,
    color: "text-amber-600",
    bg: "from-amber-100 to-amber-200",
  },

  default: {
    icon: FaUserMd,
    color: "text-slate-600",
    bg: "from-slate-100 to-slate-200",
  },
};

function getSubTypeUI(subType) {
  return subTypeConfig[subType] || subTypeConfig.default;
}

/* =========================
   MAIN COMPONENT
========================= */
export default function Services() {
  const [mapData, setMapData] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [totaleNumOfPages, setTotaleNumOfPages] = useState(null);
  const [numOfPage, setNumOfPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchData(lat, lng, numOfPage, selectedType) {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://mediconnect-api.online/api/entities/nearby",
        {
          params: {
            lat,
            lng,
            subType: selectedType,
            page: numOfPage - 1,
          },
        },
      );

      setTotaleNumOfPages(Math.ceil(response.data.totalResults / 50));

      setMapData(response.data.data);
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  function userLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      (err) => console.log(err.message),
    );
  }

  useEffect(() => {
    userLocation();
  }, []);

  useEffect(() => {
    if (lat && lng) {
      fetchData(lat, lng, numOfPage, selectedType);
    }
  }, [lat, lng, numOfPage, selectedType]);

  return (
    <>
      {/* HEADER */}
      <Header
        title1={"Healthcare Locator"}
        title2={"The best services near you"}
        description={
          "Discover medical services, book appointments quickly and connect with trusted providers effortlessly"
        }
        imgUrl={img}
      />

      {/* LOADING */}
      {loading ? (
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[400px] bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="container m-auto mb-12 mt-14">
          <h1 className="text-primaryLight font-bold text-[52px] pb-[30px]">
            Explore
          </h1>

          {/* FILTER */}
          <div className="mb-14 sm:w-full lg:w-[80%] m-auto">
            <Slider
              setSelectedType={setSelectedType}
              selectedType={selectedType}
            />
          </div>

          {/* MAP */}
          <Map data={mapData} lat={lat} lng={lng} />

          {/* CARDS */}
          <div className="flex justify-center mt-11">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
              {mapData.map((item, i) => {
                const ui = getSubTypeUI(item.subType);
                const Icon = ui.icon;

           return (
             <div
               key={i}
               className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100
    hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
             >
               {/* ICON AREA */}
               <div
                 className={`relative h-48 flex items-center justify-center bg-gradient-to-br ${ui.bg}`}
               >
                 {/* MAIN ICON */}
                 <Icon
                   className={`text-6xl ${ui.color} drop-shadow-sm group-hover:scale-110 transition-transform duration-300`}
                 />

                 {/* ================= BADGES CONTAINER ================= */}
                 <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
                   {/* SUBTYPE BADGE */}
                   <div
                     className="max-w-[70%] bg-white px-3 py-1 rounded-full 
          text-xs flex items-center gap-1 
          shadow-md border border-gray-200"
                   >
                     <Icon className={ui.color} />

                     <span className="font-medium text-gray-800 truncate">
                       {item.subType}
                     </span>
                   </div>

                   {/* DISTANCE BADGE */}
                   <div
                     className="bg-primaryDark text-white 
          text-xs px-3 py-1 rounded-full 
          font-semibold shadow-md shrink-0"
                   >
                     {item.distance.toFixed(1)} km
                   </div>
                 </div>
               </div>

               {/* CONTENT */}
               <div className="p-4 text-center flex flex-col flex-1">
                 {/* NAME */}
                 <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                   {item.name}
                 </h3>

                 {/* LOCATION */}
                 <p className="text-sm text-gray-500 line-clamp-1">
                   {item.area} - {item.governorate}
                 </p>

                 {/* PHONE */}
                 {item.phoneNumbers?.[0] && (
                   <p className="text-sm text-gray-600 mt-1">
                     📞 {item.phoneNumbers[0]}
                   </p>
                 )}

                 {/* BUTTONS */}
                 <div className="mt-auto flex flex-col gap-2 pt-4">
                   <Link
                     to={`/dashboard/appointment/${item.id}`}
                     className="w-full text-center bg-primaryLight text-white py-2 rounded-xl hover:bg-primaryDark transition font-medium"
                   >
                     Book Now
                   </Link>

                   <button
                     onClick={() => {
                       setSelectedId(item.id);
                       setOpen(true);
                     }}
                     className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition font-medium"
                   >
                     Details
                   </button>
                 </div>
               </div>
             </div>
           );
              })}
            </div>
          </div>

          {/* MODAL */}
          <Modal isOpen={open} onClose={() => setOpen(false)}>
            <Details id={selectedId} />
          </Modal>

          {/* PAGINATION */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setNumOfPage((p) => Math.max(p - 1, 1))}
              disabled={numOfPage === 1}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Prev
            </button>

            <span>
              Page {numOfPage} of {totaleNumOfPages}
            </span>

            <button
              onClick={() =>
                setNumOfPage((p) => (p < totaleNumOfPages ? p + 1 : p))
              }
              disabled={numOfPage === totaleNumOfPages}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
