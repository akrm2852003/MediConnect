import React, { useEffect, useState } from "react";
import img from "../../../assets/Logos/MainLogo.svg";
import Header from "../../../SharedModule/Components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Details({ id }) {

  const [details, setDetails] = useState(null);

  const [loading, setLoading] = useState(false);

  async function fetchDetails(id) {
    try {
          setLoading(true);
      let response = await axios.get(
        `https://mediconnect-api.online/api/entities/${id}`,
      );

      console.log(response.data.data);

      setDetails(response.data.data);
          setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <>
    
      {details && (
        <div className="  ">
          
          <div className="z-20 w-full m-auto   mx-auto   p-11 rounded-lg shadow-sm">
             <h1 className="p-3 text-center text-5xl font-bold text-primaryLight">Details</h1>
            {/* Image + Name فوق */}
            <div className="flex flex-col items-center mb-8">
              <img
                src={img}
                alt={details.name}
                className="w-32 h-32 rounded-full object-cover "
              />
              <h2 className="text-xl font-bold text-[#1B3A5D]">
                {details.name}
              </h2>
              <p className="text-[#5A7184]">{details.subType}</p>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 🔹 LEFT SIDE */}
              <div>
                {/* Address */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    Address :
                  </h3>
                  <p className="text-[#5A7184] mt-1 underline cursor-pointer">
                    {details.detailAddress}
                  </p>
                </div>

                {/* City */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    City/Area :
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.area} - {details.governorate}
                  </p>
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    Telephone :
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.phoneNumbers?.join(" - ") || "Not Available"}
                  </p>
                </div>

                {/* Working Hours */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    Working Hours :
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.is24Hours
                      ? "Open 24 Hours"
                      : `${details.openTime} - ${details.closeTime}`}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    Consultation Price :
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.consultationPrice > 0
                      ? `${details.consultationPrice} EGP`
                      : "Not specified"}
                  </p>
                </div>
              </div>

              {/* 🔹 RIGHT SIDE */}
              <div>
                {/* Rating */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">Rating :</h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.ratingAverage > 0
                      ? `${details.ratingAverage} ⭐ (${details.ratingQuantity})`
                      : "No ratings yet"}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    Description :
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.about || "No description available"}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    Contact Info :
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.fullAddress || details.listingAddress}
                  </p>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    Services :
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.specialties?.length > 0
                      ? details.specialties.join(" - ")
                      : details.departments?.length > 0
                        ? details.departments.join(" - ")
                        : "No services available"}
                  </p>
                </div>

                {/* Slots */}
                <div>
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    Available Slots :
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {details.schedule?.[0]?.slots
                      ?.filter((s) => !s.booked)
                      .slice(0, 6)
                      .map((slot, i) => (
                        <button
                          key={i}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          {slot.time}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
