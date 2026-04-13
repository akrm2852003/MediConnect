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

export default function Services() {
  const [mapData, setMapData] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [totaleNumOfPages, settotaleNumOfPages] = useState(null);
  const [numOfPage, setnumOfPage] = useState(1);
const [open, setOpen] = useState(false);
const [selectedId, setSelectedId] = useState(null);

const [loading, setLoading] = useState(false);

  async function fetchData() {
    try {
          setLoading(true);
      let response = await axios.get(
        `http://65.21.174.86:5050/api/entities/nearby?lat=${lat}&lng=${lng}&subType=Pharmacies&page=${numOfPage}`,
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

      // console.log(position.coords.latitude);
      // console.log(position.coords.longitude);
    };

    let err = function (err) {
      console.log(err.message);
    };

    navigator.geolocation.getCurrentPosition(success, err);
  }

  const toRad = (value) => (value * Math.PI) / 180;
  function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  useEffect(() => {
    userLocation();
  }, []);

  useEffect(() => {
    if (lat && lng) {
      fetchData();
    }
  }, [lat, lng, numOfPage]);

   if (loading) {
     return (
       <div className="flex items-center justify-center h-svh">
         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
       </div>
     );
   }
  
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

      <div className="container  m-auto mb-12 mt-14">
        <h1 className="text-primaryLight font-bold text-[52.19px] pb-[30px]  ">
          Explore
        </h1>
        <div className="searchForm mb-14 sm:w-[100%] lg:w-[80%] m-auto ">
          <form className="w-full flex justify-center align-center  ">
            <div className="relative    w-[90%]">
              <div className="absolute  top-10 start-[12%] flex items-center ps-3 pointer-events-none">
                <i className="fa-solid fa-magnifying-glass text-4xl  text-[#00B4D8]"></i>
              </div>

              <input
                type="search"
                id="search"
                className="block w-[80%] m-auto mt-6 py-5 ps-[100px] border border-[#1212121F] text-heading text-xl font-semibold rounded-3xl shadow-xl placeholder:text-xl placeholder:font-semibold transition-all duration-300 focus:outline-none focus:border-[#00B4D8] focus:ring-4  focus:shadow-[0_0_25px_rgba(0,180,216,0.35)]"
                placeholder="Search for doctors, hospitals......"
                required
              />
            </div>

            <button className=" block w-2/12 text-start   pt-[25px]">
              <i className="fa-solid fa-sliders text-5xl    text-[#00B4D8]"></i>
            </button>
          </form>
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
                      <span className=" text-[#052755A3] ">
                        {lat && lng && item.latitude && item.longitude
                          ? getDistance(
                              lat,
                              lng,
                              item.latitude,
                              item.longitude,
                            ).toFixed(2)
                          : ""}{" "}
                        km
                      </span>
                    </h5>
                  </div>

                  {/* BUTTONS */}
                  <div className=" flex-1 flex flex-col justify-center gap-2 px-3">
                    <Link
                      to="/register"
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
    </>
  );
}
