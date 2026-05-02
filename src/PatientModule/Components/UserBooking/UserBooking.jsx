import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function UserBooking() {
  const { t } = useTranslation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  async function fetchBookings() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://mediconnect-api.online/api/bookings/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBookings(response.data.data.bookings);
      setTotalBookings(response.data.results);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      setDeletingId(id);

      await axios.delete(`https://mediconnect-api.online/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
      );
    } catch (error) {
      alert("Failed to cancel booking");
    } finally {
      setDeletingId(null);
      setShowModal(false);
      setSelectedId(null);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">{t("bookings.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className=" md:p-8 bg-gray-50 min-h-screen">
      <div className="pt-[81px] mb-8 flex justify-center">
        <div className="bg-white shadow-md border border-gray-100 rounded-2xl px-6 py-5 flex items-center justify-between w-full max-w-3xl">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              {t("bookings.title")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("bookings.subtitle")}
            </p>
          </div>

          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-center">
            <p className="text-xs text-gray-500">{t("bookings.total")}</p>
            <p className="text-lg font-bold">{totalBookings}</p>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          {t("bookings.noBookings")}
        </p>
      ) : (
        <div className="container pt-[80] grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookings.map((booking) => {
            const isCancelled = booking.status === "cancelled";

            return (
              <div
                key={booking.id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-5 flex flex-col justify-between 
                ${isCancelled ? "opacity-60 grayscale" : ""}`}
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {booking.entity.name}
                  </h2>

                  <p className="text-sm text-gray-500 mb-3">
                    {booking.entity.address}
                  </p>

                  <div className="flex justify-between mb-3 text-sm text-gray-600">
                    <span>📅 {booking.date}</span>
                    <span>⏰ {booking.time}</span>
                  </div>

                  <div className="mb-3">
                    <span className="text-gray-500 text-sm">
                      {t("bookings.price")}:
                    </span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {booking.price === 0
                        ? t("bookings.free")
                        : `${booking.price} EGP`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>

                  <div className="flex gap-2">
                    <button
                      className={`text-sm px-3 py-1.5 rounded-lg text-white transition ${
                        isCancelled
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      disabled={isCancelled}
                    >
                      {booking.entity.type}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedId(booking.id);
                        setShowModal(true);
                      }}
                      disabled={deletingId === booking.id || isCancelled}
                      className={`text-sm px-3 py-1.5 rounded-lg text-white transition ${
                        deletingId === booking.id || isCancelled
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-primaryDark hover:bg-primaryDark80"
                      }`}
                    >
                      {deletingId === booking.id
                        ? t("bookings.cancelling")
                        : t("bookings.cancel")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800">
              {t("bookings.cancelTitle")}
            </h2>

            <p className="text-gray-500 mt-2">{t("bookings.cancelText")}</p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedId(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                {t("bookings.no")}
              </button>

              <button
                onClick={() => handleDelete(selectedId)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {t("bookings.yes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
