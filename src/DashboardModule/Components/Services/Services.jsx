import React, { useEffect, useState } from "react";
import img from "../../../assets/images/HeaderImg/Services-Header.png";
import testImg from "../../../assets/images/test.png";
import Header from "../../../SharedModule/Components/Header/Header";
import styles from "./Services.module.css";
import Map from "./Map";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "../Popup/Popup";
import Details from "../Details/Details";
import Slider from "../Slider/Slider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
export default function Services() {
  const [mapData, setMapData] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [totaleNumOfPages, settotaleNumOfPages] = useState(null);
  const [numOfPage, setnumOfPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [selectedType, setSelectedType] = useState(null);

  const [loading, setLoading] = useState(false);



  async function fetchData(lat, lng, numOfPage, selectedType) {
    try {
      setLoading(true);
      console.log("selectedType:", selectedType);
      let response = await axios.get(
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
      let data = response.data.data;
      settotaleNumOfPages(Math.ceil(response.data.totalResults / 50));

      setMapData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  function userLocation() {
    let success = function (position) {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    };

    let err = function (err) {
      console.log(err.message);
    };

    navigator.geolocation.getCurrentPosition(success, err);
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
      <Header
        title1={"Healthcare Locator"}
        title2={"The best services near you"}
        description={
          "Discover medical services ,book appointments \n quickly and connect with trusted \n providers effortlessly"
        }
        imgUrl={img}
      />

      {loading ? (
        <div className="flex items-center justify-center h-svh">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="container   m-auto mb-12 mt-14">
          <h1 className="text-primaryLight font-bold text-[52.19px] pb-[30px]  ">
            Explore
          </h1>
          <div className="searchForm mb-14 sm:w-[100%] lg:w-[80%] m-auto ">
            <Slider
              setSelectedType={setSelectedType}
              selectedType={selectedType}
            />
          </div>

          <div className="w-full h-auto rounded-lg map">
            <Map data={mapData} lat={lat} lng={lng} />
          </div>

          <div className="flex justify-center mt-11">
            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center w-full max-w-7xl">
              {mapData.map((item, i) => {
                return (
                  <div
                    key={i}
                    className={`${styles.card} w-full h-[400px] overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col`}
                  >
                    {/* IMAGE */}
                    <div className=" flex-1 flex items-center justify-center">
                      <img
                        className="w-[40%] h-[90%] object-cover"
                        src={testImg}
                        alt=""
                      />
                    </div>

                    {/* TITLE */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <h5 className="text-2xl font-semibold tracking-tight text-heading m-0">
                        {item.name}
                      </h5>
                      <h5 className="text-2xl text-primary font-semibold">
                        Distance :{" "}
                        <span className="text-[#052755A3]">
                          {item.distance.toFixed(1)} km
                        </span>
                      </h5>
                    </div>

                    {/* BUTTONS */}
                    <div className=" flex-1 flex flex-col justify-center gap-2 px-3">
                      <Link
                        to={`/dashboard/appointment/${item.id}`}
                        className="block  py-3 w-full text-center text-white bg-primaryLight hover:bg-brand-strong shadow-xs font-medium text-sm  rounded-[13px]"
                      >
                        Book Now
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedId(item.id);
                          setOpen(true);
                        }}
                        className="block py-3 w-full text-center text-white bg-primaryDark hover:bg-brand-strong rounded-[13px]"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Modal isOpen={open} onClose={() => setOpen(false)}>
            <Details id={selectedId} />
          </Modal>

          

          <div className="flex items-center justify-center gap-3 mt-4">
            {/* Prev Button */}
            <button
              onClick={() => {
                if (numOfPage > 1) {
                  setnumOfPage(numOfPage - 1);
                }
              }}
              disabled={numOfPage === 1}
              className={`px-4 py-2 rounded-md font-medium transition
      ${
        numOfPage === 1
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
            >
              Prev
            </button>

            {/* Page Indicator */}
            <span className="text-sm font-semibold">
              Page {numOfPage} of {totaleNumOfPages}
            </span>

            {/* Next Button */}
            <button
              onClick={() => {
                if (numOfPage < totaleNumOfPages) {
                  setnumOfPage(numOfPage + 1);
                }
              }}
              disabled={numOfPage === totaleNumOfPages}
              className={`px-4 py-2 rounded-md font-medium transition
      ${
        numOfPage === totaleNumOfPages
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-green-600 text-white hover:bg-green-700"
      }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
