"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBolt } from "react-icons/fa";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Main Content */}
          <div className="relative flex flex-col items-center">
            {/* Animated Logo Container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20,
                delay: 0.2 
              }}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-[#00D26A] rounded-[32px] flex items-center justify-center shadow-2xl shadow-green-200 mb-8 relative"
            >
              <FaBolt className="text-white text-5xl sm:text-7xl" />
              
              {/* Pulse Ring */}
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-4 border-[#00D26A] rounded-[32px]"
              />
            </motion.div>

            {/* Website Name */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "circOut", delay: 0.5 }}
                className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight"
              >
                Digital Ad <span className="text-[#00D26A]">Bird</span>
              </motion.h1>
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-4 text-gray-400 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm"
            >
              The Future of Ads & Automation
            </motion.p>
          </div>

          {/* Progress Bar Background */}
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-50">
            {/* Animated Progress Bar */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-gradient-to-r from-[#00D26A] to-green-400 shadow-[0_0_10px_rgba(0,210,106,0.5)]"
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-50 rounded-full blur-[120px] opacity-40 -z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
