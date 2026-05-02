import React, { useEffect, useState } from "react";
import img from "../../../assets/Logos/MainLogo.svg";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function Details({ id }) {
  const { t } = useTranslation();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchDetails(id) {
    try {
      setLoading(true);

      let response = await axios.get(
        `https://mediconnect-api.online/api/entities/${id}`,
      );

      setDetails(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchDetails(id);
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
        <div>
          <div className="z-20 w-full m-auto mx-auto p-11 rounded-lg shadow-sm">
            {/* TITLE */}
            <h1 className="p-3 text-center text-5xl font-bold text-primaryLight">
              {t("details")}
            </h1>

            {/* HEADER INFO */}
            <div className="flex flex-col items-center mb-8">
            
              <h2 className="text-xl font-bold text-[#1B3A5D]">
                {details.name}
              </h2>

              <p className="text-[#5A7184]">{details.subType}</p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT SIDE */}
              <div>
                {/* Address */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    {t("address")}
                  </h3>
                  <p className="text-[#5A7184] mt-1 underline cursor-pointer">
                    {details.detailAddress}
                  </p>
                </div>

                {/* City */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    {t("cityArea")}
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.area} - {details.governorate}
                  </p>
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    {t("telephone")}
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.phoneNumbers?.join(" - ") || t("notAvailable")}
                  </p>
                </div>

                {/* Working Hours */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    {t("workingHours")}
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.is24Hours
                      ? t("open24Hours")
                      : `${details.openTime} - ${details.closeTime}`}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    {t("price")}
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.consultationPrice > 0
                      ? `${details.consultationPrice} EGP`
                      : t("notSpecified")}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div>
                {/* Rating */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    {t("rating")}
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.ratingAverage > 0
                      ? `${details.ratingAverage} ⭐ (${details.ratingQuantity})`
                      : t("noRatings")}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    {t("description")}
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.about || t("noDescription")}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    {t("contactInfo")}
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.fullAddress || details.listingAddress}
                  </p>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    {t("services")}
                  </h3>
                  <p className="text-[#5A7184] mt-1">
                    {details.specialties?.length > 0
                      ? details.specialties.join(" - ")
                      : details.departments?.length > 0
                        ? details.departments.join(" - ")
                        : t("noServices")}
                  </p>
                </div>

                {/* Slots */}
                <div>
                  <h3 className="font-bold text-lg text-[#1B3A5D]">
                    {t("availableSlots")}
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
