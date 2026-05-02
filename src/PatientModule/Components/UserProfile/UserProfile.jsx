import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../../Conetxt/AuthContext/AuthContext";
import userImg from "../../../assets/images/UserImg.png";
import style from "./UserProfile.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function UserProfile() {
  const { t } = useTranslation();
  const { userData } = useContext(AuthContext);
  const user = userData;
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`${style.bgImg} fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm lg:pt-[80px]`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal */}
        <motion.div
          className="w-full sm:h-screen lg:h-[80vh] lg:max-w-4xl bg-white lg:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          initial={{ scale: 0.8, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1B3A5D] to-[#2A6F97] p-6 text-center shrink-0">
            <h1 className="text-3xl font-bold text-white">{t("myProfile")}</h1>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10 overflow-y-auto">
            {/* Avatar */}
            <motion.div
              className="flex flex-col items-center text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.img
                src={userImg}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#1B3A5D] shadow-md"
                whileHover={{ scale: 1.1 }}
              />

              <h2 className="mt-3 text-2xl font-bold text-[#1B3A5D]">
                {user.name}
              </h2>

              <p className="text-sm text-gray-500">{user.email}</p>

              {/* Appointments Button */}
              <motion.button
                onClick={() => navigate("/dashboard/user-bookings")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="mt-5 px-7 py-3 rounded-2xl text-white font-bold
                bg-gradient-to-r from-[#1B3A5D] to-[#2A6F97]
                shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {t("viewAppointments")} 📅
              </motion.button>
            </motion.div>

            {/* Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.08 },
                },
              }}
            >
              <div className="space-y-4">
                <AnimatedCard title={t("phone")} value={user.phone} />
                <AnimatedCard
                  title={t("ageGender")}
                  value={`${user.age} - ${user.gender}`}
                />
                <AnimatedCard
                  title={t("nationalId")}
                  value={user.national_id}
                />
                <AnimatedCard title={t("birthDate")} value={user.birth_date} />
                <AnimatedCard title={t("occupation")} value={user.occupation} />
              </div>

              <div className="space-y-4">
                <AnimatedCard
                  title={t("address")}
                  value={`${user.address?.street}, ${user.address?.city}`}
                />

                <AnimatedCard
                  title={t("govCountry")}
                  value={`${user.address?.governorate} - ${user.address?.country}`}
                />

                <div className="grid grid-cols-2 gap-4">
                  <AnimatedBadge
                    title={t("bloodType")}
                    value={user.blood_type}
                  />
                  <AnimatedBadge
                    title={t("allergies")}
                    value={
                      user.allergies?.length
                        ? user.allergies.join(", ")
                        : t("none")
                    }
                  />
                </div>

                <AnimatedCard
                  title={t("medicalHistory")}
                  value={
                    user.medical_history?.length
                      ? user.medical_history.join(" • ")
                      : t("noData")
                  }
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- Cards ---------- */

function AnimatedCard({ title, value }) {
  return (
    <motion.div
      className="bg-gray-100 border border-gray-100 rounded-xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xs uppercase text-primary font-semibold">{title}</h3>
      <p className="text-[#1B3A5D] font-medium mt-1 break-words">{value}</p>
    </motion.div>
  );
}

function AnimatedBadge({ title, value }) {
  return (
    <motion.div
      className="border rounded-xl p-4 text-center bg-white shadow-sm"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <h3 className="text-xs text-gray-400 uppercase">{title}</h3>
      <p className="font-bold text-[#1B3A5D] mt-1">{value}</p>
    </motion.div>
  );
}
