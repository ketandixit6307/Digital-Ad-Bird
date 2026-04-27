"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaShieldAlt, FaStar } from "react-icons/fa";

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["Automation", "AI Chatbot", "Broadcast", "Marketing"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 1500); // 1.5s feels smoother than 1s for reading
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-white pt-20 pb-16">
        {/* subtle festive background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-flex items-center px-6 py-1.5 rounded-full bg-orange-50 text-[#FF7A00] text-[13px] font-bold mb-10 border border-[#FF7A00]/30 shadow-sm">
              AI-Powered WhatsApp Engagement Platform
            </span>
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[40px] sm:text-[56px] lg:text-[72px] font-extrabold tracking-tight leading-[1.1] mb-8 text-black"
          >
            5X Your Revenue with<br />
            <span className="text-[#25D366]">WhatsApp</span><br />
            <div className="h-[1.2em] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[currentWordIndex]}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-[#FF7A00] block"
                >
                  {words[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[17px] sm:text-[19px] text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Run powerful WhatsApp campaigns and grow your conversions with<br />
            Digital Ad Bird&apos;s <span className="text-[#25D366] font-bold">AI-powered</span> WhatsApp Engagement suite.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
          >
            <Link
              href="/signup"
              className="bg-[#25D366] hover:bg-[#20bd5b] text-white px-10 py-4 rounded-full transition-all flex items-center justify-center min-w-[320px] shadow-lg shadow-green-100"
            >
              <span className="text-[16px] font-bold tracking-tight">
                GET NEW YEAR OFFER From <span className="line-through opacity-80 ml-1">₹2,500</span> <span className="text-white font-black ml-1">₹1,395</span>
              </span>
            </Link>
            <a
              href="#pricing"
              className="px-10 py-4 text-[15px] font-bold text-[#00A859] border-2 border-[#00A859] hover:bg-green-50 rounded-[14px] transition-all min-w-[240px]"
            >
              View Offer Plans
            </a>
          </motion.div>

          {/* trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-3 text-[14px] font-medium text-gray-500"
          >
            <span>Official WhatsApp BSP</span>
            <span className="text-[#25D366] text-xl leading-none">•</span>
            <span>700Cr+ Messages Done</span>
          </motion.div>
        </div>
      </section>

      {/* ─── Video / About section ─── */}
      <section id="about" className="py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-4">
              Deep Dive into Digital Ad Bird
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-sm">
              See how 2,10,000+ businesses use Digital Ad Bird to broadcast, automate, and sell on WhatsApp
            </p>
          </div>

          {/* video embed placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gray-900 mb-10"
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
              title="Digital Ad Bird Platform Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>

          {/* rating badges */}
          <div className="flex flex-wrap justify-center gap-8 mb-20">
            <div className="flex items-center gap-8 bg-white/50 backdrop-blur-sm rounded-full px-8 py-3 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-4 object-contain" />
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="h-3 w-3 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">5.0</span>
                <span className="text-[11px] text-gray-500">(870+ reviews)</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold italic text-lg">G2</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="h-3 w-3 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">5.0</span>
                <span className="text-[11px] text-gray-500">(65+ reviews)</span>
              </div>
            </div>
          </div>

          {/* Logo Marquee Section */}
          <div className="pt-10 border-t border-gray-100">
            <p className="text-center text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-10">
              TRUSTED BY 210,000+ BUSINESSES WORLDWIDE
            </p>
            
            <div className="relative overflow-hidden">
              {/* fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cream to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cream to-transparent z-10" />
              
              <motion.div
                className="flex gap-20 items-center whitespace-nowrap"
                animate={{
                  x: [0, -1200], // Adjust based on content width
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
                {[
                  { name: "TurtleMint", color: "text-[#10B981]" },
                  { name: "TATA", color: "text-[#1D4ED8]" },
                  { name: "PayU", color: "text-[#84CC16]" },
                  { name: "AsianPaints", color: "text-[#EF4444]" },
                  { name: "PhysicsWallah", color: "text-[#111827]" },
                  { name: "Aditya Birla", color: "text-[#B91C1C]" },
                  { name: "HomeLane", color: "text-[#F97316]" },
                  { name: "Gati", color: "text-[#1E40AF]" },
                  { name: "TurtleMint", color: "text-[#10B981]" },
                  { name: "TATA", color: "text-[#1D4ED8]" },
                  { name: "PayU", color: "text-[#84CC16]" },
                  { name: "AsianPaints", color: "text-[#EF4444]" },
                  { name: "PhysicsWallah", color: "text-[#111827]" },
                  { name: "Aditya Birla", color: "text-[#B91C1C]" },
                  { name: "HomeLane", color: "text-[#F97316]" },
                  { name: "Gati", color: "text-[#1E40AF]" }
                ].map((logo, index) => (
                  <span key={index} className={`text-2xl font-black ${logo.color} tracking-tighter filter saturate-[0.8] opacity-90 hover:opacity-100 transition-all cursor-default`}>
                    {logo.name}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
