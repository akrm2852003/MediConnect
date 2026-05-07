import React, { useState } from "react";
import styles from "./ClinicBottomSheet.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Modal from "../../../DashboardModule/Components/Popup/Popup";
import Details from "../../../DashboardModule/Components/Details/Details";

export default function ClinicBottomSheet({ clinics, subType, onClose }) {
  const { t } = useTranslation();

  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const filtered = clinics.filter((c) => {
    if (filter === "available") return c.bookingEnabled;
    return true;
  });

  const visibleClinics = expanded ? filtered : filtered.slice(0, 4);

  const colors = [
    { bg: "#E1F5EE", color: "#0F6E56" },
    { bg: "#E6F1FB", color: "#185FA5" },
    { bg: "#EEEDFE", color: "#534AB7" },
    { bg: "#FAEEDA", color: "#854F0B" },
    { bg: "#FAECE7", color: "#993C1D" },
  ];

  function getInitials(name) {
    const clean = name
      .replace(/^د\.?\s*/, "")
      .trim()
      .split(" ");
    return clean
      .slice(0, 2)
      .map((p) => p[0])
      .join("");
  }

  return (
    <div className={styles.bsOverlay}>
      <div className={styles.bsSheet}>
        {/* Handle + header */}
        <div className={styles.bsTop}>
          <div className={styles.bsHandle} />

          <div className={styles.bsHeaderRow}>
            <div>
              <span className={styles.bsTitle}>
                {t("clinics_nearby", { count: filtered.length })}
              </span>

              {subType && (
                <span className={styles.bsSubType}> · {subType}</span>
              )}
            </div>

            <div className={styles.bsHeaderRight}>
              <div className={styles.bsFilters}>
                <button
                  className={`${styles.bsFilter} ${
                    filter === "all" ? styles.bsFilterActive : ""
                  }`}
                  onClick={() => setFilter("all")}
                >
                  {t("all")}
                </button>

                <button
                  className={`${styles.bsFilter} ${
                    filter === "available" ? styles.bsFilterActive : ""
                  }`}
                  onClick={() => setFilter("available")}
                >
                  {t("available_only")}
                </button>
              </div>

              <button className={styles.bsClose} onClick={onClose}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className={styles.bsCards}>
          {visibleClinics.map((clinic, i) => {
            const palette = colors[i % colors.length];
            const distKm =
              clinic.distance != null
                ? `${clinic.distance.toFixed(1)} كم`
                : null;
            const phone = clinic.phoneNumbers?.[0];
            const available = clinic.bookingEnabled;

            return (
              <div key={clinic.id} className={styles.bsCard}>
                <div
                  className={styles.bsCardAvatar}
                  style={{ background: palette.bg, color: palette.color }}
                >
                  {getInitials(clinic.name)}
                </div>

                <div className={styles.bsCardInfo}>
                  <div className={styles.bsCardName}>{clinic.name}</div>

                  <div className={styles.bsCardSub}>
                    {clinic.area && (
                      <>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 16 16"
                          fill="none"
                          style={{ flexShrink: 0 }}
                        >
                          <circle
                            cx="8"
                            cy="7"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M8 2C5.24 2 3 4.24 3 7c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                          />
                        </svg>

                        {clinic.area}
                        {distKm && ` · ${distKm}`}
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.bsCardRight}>
                  <span
                    className={
                      available ? styles.bsAvailGreen : styles.bsAvailGray
                    }
                  >
                    ● {available ? t("available") : t("not_available")}
                  </span>

                  <div className={styles.bsCardBtns}>
                    
                    <Link
                      to={`/dashboard/appointment/${clinic.id}`}
                      className={styles.bsCallBtn}
                    >
                      {t("book_now")}
                    </Link>

                    <button
                      onClick={() => {
                        setSelectedId(clinic.id);
                        setOpen(true);
                      }}
                      className={styles.bsDetailBtn}
                    >
                      {t("details")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL */}
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <Details id={selectedId} />
        </Modal>

        {/* Show more */}
        {filtered.length > 4 && (
          <button
            className={styles.bsShowMore}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded
              ? t("show_less")
              : t("show_more", {
                  count: filtered.length - 4,
                })}
          </button>
        )}
      </div>
    </div>
  );
}
