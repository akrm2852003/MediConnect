import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactDOM from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  const { t } = useTranslation();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.7, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, y: 50, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white w-[92%] max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl p-5"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primaryDark hover:text-white transition"
              aria-label={t("close")}
            >
              {t("closeIcon", { defaultValue: "✕" })}
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
