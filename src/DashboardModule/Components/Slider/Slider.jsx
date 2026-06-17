import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

export default function Slider({
  setSelectedType,
  selectedType,
  onFilterApply,
}) {
  const [subTypes, setSubTypes] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [areas, setAreas] = useState([]);
  const [open, setOpen] = useState(false);

  // Local filter state inside the modal
  const [filters, setFilters] = useState({
    subType: "",
    governorate: "",
    area: "",
  });

  async function uniqueFilters() {
    try {
      const response = await axios.get(
        "https://mediconnect-api.online/api/entities/unique-filters",
      );
      setSubTypes(response.data.data.subTypes);
      setGovernorates(response.data.data.governorates);
      setAreas(response.data.data.areas);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    uniqueFilters();
  }, []);

  function handleApply() {
    // If at least one filter is set, call onFilterApply with the filter params
    if (filters.subType || filters.governorate || filters.area) {
      onFilterApply(filters);
    } else {
      // Nothing selected → fall back to the current selectedType (nearby mode)
      setSelectedType(selectedType);
    }
    setOpen(false);
  }

  function handleReset() {
    setFilters({ subType: "", governorate: "", area: "" });
    setSelectedType(null);
    onFilterApply({ subType: "", governorate: "", area: "" });
    setOpen(false);
  }

  return (
    <>
      <div className="w-[100%] flex justify-between m-auto mt-6 py-4 px-5 border border-[#1212121F] rounded-3xl shadow-xl bg-white transition-all duration-300 focus-within:border-[#00B4D8] focus-within:ring-4 focus-within:ring-[rgba(0,180,216,0.2)]">
        {/* SWIPER */}
        <div className="w-[95%]">
          <Swiper
            modules={[Autoplay, FreeMode]}
            slidesPerView="auto"
            spaceBetween={12}
            loop={true}
            speed={4000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            freeMode={true}
          >
            {subTypes.map((type, index) => (
              <SwiperSlide key={index} style={{ width: "auto" }}>
                <button
                  onClick={() => {
                    // Toggle off if already selected
                    setSelectedType(selectedType === type ? null : type);
                  }}
                  className={`
                    px-6 py-2 rounded-xl border-[3px] border-primaryLight text-sm font-semibold whitespace-nowrap
                    transition-all duration-300
                    ${
                      selectedType === type
                        ? "bg-primaryLight text-white shadow-md"
                        : "bg-[#F8FAFC] text-heading hover:bg-[#00B4D8] hover:text-white"
                    }
                  `}
                >
                  {type}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* FILTER BUTTON */}
        <div className="w-[5%] flex justify-end">
          <button
            onClick={() => setOpen(true)}
            className="w-12 h-12 rounded-xl bg-primaryLight text-white flex items-center justify-center shadow-md"
          >
            <i className="fa-solid fa-filter"></i>
          </button>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* SUB TYPES */}
            <select
              className="w-full p-2 border rounded mb-3"
              value={filters.subType}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, subType: e.target.value }))
              }
            >
              <option value="">Select SubType</option>
              {subTypes.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* GOVERNORATES */}
            <select
              className="w-full p-2 border rounded mb-3"
              value={filters.governorate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, governorate: e.target.value }))
              }
            >
              <option value="">Select Governorate</option>
              {governorates.map((g, i) => (
                <option key={i} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* AREAS */}
            <select
              className="w-full p-2 border rounded mb-3"
              value={filters.area}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, area: e.target.value }))
              }
            >
              <option value="">Select Area</option>
              {areas.map((a, i) => (
                <option key={i} value={a}>
                  {a}
                </option>
              ))}
            </select>

            {/* ACTIONS */}
            <div className="flex justify-between gap-2 mt-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
              >
                Reset
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleApply}
                  className="px-4 py-2 bg-primaryLight text-white rounded hover:bg-primaryDark transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
