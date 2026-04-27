"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function PromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds if not dismissed this session
    const dismissed = sessionStorage.getItem("promoDismissed");
    if (!dismissed) {
      const id = setTimeout(() => setOpen(true), 2000);
      return () => clearTimeout(id);
    }
  }, []);

  const dismiss = () => {
    setOpen(false);
    sessionStorage.setItem("promoDismissed", "1");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden pointer-events-auto">
              {/* close button */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-gray-100 transition-colors"
                aria-label="Close popup"
              >
                <FaTimes className="h-4 w-4 text-gray-600" />
              </button>

              {/* gradient header */}
              <div className="bg-gradient-to-br from-primary to-primary-dark px-8 pt-10 pb-8 text-center">
                <div className="text-5xl mb-3">🎁</div>
                <h2 className="text-2xl font-extrabold text-white mb-1">Limited Time</h2>
                <h2 className="text-2xl font-extrabold text-white mb-3">Special Offer</h2>
                <p className="text-sm text-white/80">
                  5X Your Sales with Digital Ad Bird&apos;s WhatsApp Automation Platform
                </p>
              </div>

              {/* body */}
              <div className="px-8 py-6 text-center">
                <div className="inline-flex flex-col items-center gap-1 mb-4">
                  <span className="text-xs text-muted line-through">₹2,000/month</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-dark">₹1,395</span>
                    <span className="text-muted text-sm">/ month</span>
                  </div>
                  <span className="px-3 py-1 bg-primary-light text-primary text-xs font-bold rounded-full">
                    Save 30% — New Year Deal
                  </span>
                </div>

                <ul className="text-left space-y-2 mb-6">
                  {[
                    "Free WhatsApp Business API",
                    "Unlimited Broadcasting",
                    "AI Template Generator",
                    "14-Day Money-Back Guarantee",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  onClick={dismiss}
                  className="block w-full py-3.5 text-sm font-bold text-white bg-dark hover:bg-gray-800 rounded-full transition-colors mb-3"
                >
                  GET NEW YEAR OFFER Now
                </Link>

                <button
                  onClick={dismiss}
                  className="text-xs text-muted hover:text-gray-700 transition-colors"
                >
                  No thanks, I&apos;ll skip the discount
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
