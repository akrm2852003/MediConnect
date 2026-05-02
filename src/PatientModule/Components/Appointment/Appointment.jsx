import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./Appointment.module.css";
import { toast } from "react-toastify";

// 👇 لو عندك i18n استخدمه (زي باقي الموقع)
import { useTranslation } from "react-i18next";

export default function Appointment() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [viewYear, setViewYear] = useState(null);
  const [viewMonth, setViewMonth] = useState(null);

  async function fetchDetails(id) {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://mediconnect-api.online/api/entities/${id}`,
      );
      const data = response.data.data;
      setDetails(data);

      if (data?.schedule?.length > 0) {
        const first = data.schedule[0].date;
        setSelectedDate(first);
        const [y, m] = first.split("-").map(Number);
        setViewYear(y);
        setViewMonth(m - 1);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function createBooking(id, selectedDate, selectedTime) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://mediconnect-api.online/api/bookings`,
        { entityId: id, date: selectedDate, time: selectedTime },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(response.data.message, {
        autoClose: 5000,
        theme: "light",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || t("booking_failed"), {
        autoClose: 5000,
        theme: "dark",
      });
    }
  }

  useEffect(() => {
    if (id) fetchDetails(id);
  }, [id]);

  const schedule = details?.schedule || [];

  const scheduleDates = useMemo(
    () => new Set(schedule.map((d) => d.date)),
    [schedule],
  );

  const selectedDay = useMemo(
    () => schedule.find((d) => d.date === selectedDate),
    [selectedDate, schedule],
  );

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const DOWS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  function toDateStr(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function formatTime(t) {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "pm" : "am";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  const calendarDays = useMemo(() => {
    if (viewYear === null) return [];

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const offset = (firstDay + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const days = [];

    for (let i = 0; i < offset; i++)
      days.push({ day: prevMonthDays - offset + 1 + i, type: "prev" });

    for (let d = 1; d <= daysInMonth; d++) {
      const ds = toDateStr(viewYear, viewMonth, d);
      days.push({
        day: d,
        date: ds,
        type: scheduleDates.has(ds) ? "active" : "normal",
      });
    }

    return days;
  }, [viewYear, viewMonth, scheduleDates]);

  if (loading) return <div className={styles.loading}>{t("loading")}</div>;
  if (!details || viewYear === null) return null;

  return (
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn}>←</button>
        <span className={styles.headerTitle}>{t("appointment_title")}</span>
      </div>

      <div className={styles.body}>
        {/* Calendar */}
        <div className={styles.calSection}>
          <div className={styles.sectionLabel}>{t("date")}</div>

          <div className={styles.calHeader}>
            <span className={styles.calMonth}>
              {t(MONTHS[viewMonth])} {viewYear}
            </span>

            <div>
              <button className={styles.calNav} onClick={prevMonth}>
                ‹
              </button>
              <button className={styles.calNav} onClick={nextMonth}>
                ›
              </button>
            </div>
          </div>

          <div className={styles.calGrid}>
            {DOWS.map((d) => (
              <div key={d} className={styles.calDow}>
                {t(d)}
              </div>
            ))}

            {calendarDays.map((cell, i) => (
              <div
                key={i}
                onClick={() => {
                  if (cell.type === "active") {
                    setSelectedDate(cell.date);
                    setSelectedTime(null);
                  }
                }}
                className={[
                  styles.calDay,
                  cell.type === "prev" ? styles.calOther : "",
                  cell.type === "active" ? styles.calActive : "",
                  cell.date === selectedDate ? styles.calSelected : "",
                ].join(" ")}
              >
                {cell.day}
              </div>
            ))}
          </div>
        </div>

        {/* Slots */}
        <div className={styles.slotsSection}>
          <div className={styles.sectionLabel}>{t("available_time")}</div>

          <div className={styles.timeGrid}>
            {selectedDay?.slots.map((slot, i) => (
              <button
                key={i}
                disabled={slot.booked}
                onClick={() => !slot.booked && setSelectedTime(slot.time)}
                className={[
                  styles.timeSlot,
                  slot.booked ? styles.slotBooked : styles.slotAvailable,
                  selectedTime === slot.time ? styles.slotSelected : "",
                ].join(" ")}
              >
                {formatTime(slot.time)}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footerBar}>
          <button
            className={styles.continueBtn}
            onClick={() => {
              if (selectedDate && selectedTime) {
                createBooking(id, selectedDate, selectedTime);
              }
            }}
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
