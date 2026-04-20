import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

export default function slider({ setSelectedType, selectedType }) {
  const [subTypes, setSubTypes] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [areas, setAreas] = useState([]);
    const [open, setOpen] = useState(false);
  

  async function uniqueFilters() {
    try {
      let response = await axios.get(
        `https://mediconnect-api.online/api/entities/unique-filters`,
      );

      let data = response.data.data;

      setSubTypes(response.data.data.subTypes);
      setGovernorates(response.data.data.governorates);
      setAreas(response.data.data.areas);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    uniqueFilters();
  }, []);

  return (
    <>
      <div className="w-[100%] flex justify-between  m-auto mt-6 py-4 px-5 border border-[#1212121F] rounded-3xl shadow-xl bg-white transition-all duration-300 focus-within:border-[#00B4D8] focus-within:ring-4 focus-within:ring-[rgba(0,180,216,0.2)]">
        <div className=" w-[95%]">
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
                    console.log("CLICKED TYPE =", type);
                    setSelectedType(type);
                  }}
                  className={`
                px-6 py-2 rounded-xl border-[3px] border-primaryLight  text-sm font-semibold whitespace-nowrap
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

        <div className="w-[5%] flex justify-end ">
          <button
            onClick={() => setOpen(true)}
            className="w-12 h-12 rounded-xl bg-primaryLight text-white flex items-center justify-center shadow-md"
          >
            <i class="fa-solid fa-filter"></i>
          </button>
        </div>

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[400px] p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-4">Filters</h2>

              {/* SUB TYPES */}
              <select
                className="w-full p-2 border rounded mb-3"
                onChange={(e) =>
                  setFilters({ ...filters, subType: e.target.value })
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
                onChange={(e) =>
                  setFilters({ ...filters, governorate: e.target.value })
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
                onChange={(e) =>
                  setFilters({ ...filters, area: e.target.value })
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
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    console.log("APPLY FILTERS:", filters);
                    setSelectedType(filters.subType || selectedType);
                    setOpen(false);
                  }}
                  className="px-4 py-2 bg-primaryLight text-white rounded"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}






