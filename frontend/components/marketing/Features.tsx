"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

/* ── feature carousel items ── */
const carouselFeatures = [
  {
    title: "Import & Broadcast Instantly",
    emoji: "📢",
    color: "bg-green-50 border-green-200",
    desc: "Light up your customer reach in seconds. Upload contacts and fire off personalized WhatsApp campaigns with one click.",
    badge: "Broadcasting",
  },
  {
    title: "Drive 5x Leads with Click to WhatsApp Ads",
    emoji: "🎯",
    color: "bg-orange-50 border-orange-200",
    desc: "Run festive ads that convert better. Connect Facebook/Instagram ads directly to WhatsApp conversations.",
    badge: "Ads",
  },
  {
    title: "Smart Retargeting for 3X Sales",
    emoji: "🔁",
    color: "bg-blue-50 border-blue-200",
    desc: "Turn festive interest into festive sales. Retarget engaged users with follow-up messages at the right moment.",
    badge: "Retargeting",
  },
  {
    title: "Build WhatsApp Forms",
    emoji: "📋",
    color: "bg-purple-50 border-purple-200",
    desc: "Collect festive leads without leaving chat. Create multi-step forms that run entirely inside WhatsApp.",
    badge: "Forms",
  },
  {
    title: "Collect Payments on WhatsApp",
    emoji: "💳",
    color: "bg-yellow-50 border-yellow-200",
    desc: "Perfect for holiday offers. Let customers pay without leaving the chat — zero friction, higher conversions.",
    badge: "Payments",
  },
];

/* ── end-to-end funnel cards ── */
const funnelFeatures = [
  {
    emoji: "🎯",
    title: "5X Your Lead Generation with Click to WhatsApp Ads",
    desc: "Run ads that open WhatsApp directly. Capture leads without landing pages with automated qualification.",
  },
  {
    emoji: "🤖",
    title: "Generate Template Messages",
    desc: "Create compelling WhatsApp message templates in seconds instantly. No copywriting skills needed.",
  },
  {
    emoji: "📡",
    title: "Broadcast Messages to Unlimited Users Officially",
    desc: "Send bulk WhatsApp messages through the official API with no risk of account bans.",
  },
  {
    emoji: "🔧",
    title: "Build Chatbots with Drag & Drop Builder",
    desc: "No-code chatbot builder with automated responses for 24/7 automated customer support.",
  },
  {
    emoji: "📊",
    title: "Behavior-Based Retargeting for Higher Conversions",
    desc: "Track user behavior and send personalized messages at the perfect time to increase ROI by 3x.",
  },
  {
    emoji: "🛒",
    title: "Automate Abandoned Cart Notifications & Reminders",
    desc: "Recover lost sales with smart timing algorithms and rich media product cards.",
  },
  {
    emoji: "🔗",
    title: "Integrations with Shopify, WooCommerce & More",
    desc: "One-click integrations with real-time sync and custom API support for your existing tools.",
  },
  {
    emoji: "💬",
    title: "Multi-Agent Live Chat Dashboard",
    desc: "Manage customer conversations at scale with agent transfer, manager monitoring, and shared inbox.",
  },
];

export default function Features() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? carouselFeatures.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === carouselFeatures.length - 1 ? 0 : c + 1));

  return (
    <>
      {/* ─── One Platform Carousel ─── */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              One Platform for Everything WhatsApp
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-sm">
              Broadcast, Automate, Engage, Sell — Do Everything with the automated WhatsApp Engagement Platform
            </p>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35 }}
                className={`rounded-3xl border-2 p-10 md:p-14 flex flex-col md:flex-row items-center gap-10 ${carouselFeatures[current].color}`}
              >
                <div className="flex-shrink-0 text-8xl md:text-9xl">
                  {carouselFeatures[current].emoji}
                </div>
                <div className="text-left">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-white rounded-full border border-primary/20 mb-4">
                    {carouselFeatures[current].badge}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                    {carouselFeatures[current].title}
                  </h3>
                  <p className="text-muted text-base mb-6 max-w-lg">
                    {carouselFeatures[current].desc}
                  </p>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-full transition-colors"
                  >
                    Claim Offer
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* nav buttons */}
            <button
              onClick={prev}
              className="absolute -left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
              aria-label="Previous"
            >
              <FaChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={next}
              className="absolute -right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
              aria-label="Next"
            >
              <FaChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* dots */}
          <div className="flex justify-center gap-2 mt-8">
            {carouselFeatures.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-primary" : "w-2 bg-gray-300"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── End-to-End Funnel Grid ─── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              End-to-End WhatsApp Engagement Funnel
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-sm">
              Everything you need to acquire, engage, convert, and retain customers on WhatsApp
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {funnelFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow flex gap-5"
              >
                <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-primary-light flex items-center justify-center text-2xl">
                  {f.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-2 text-base leading-snug">{f.title}</h3>
                  <p className="text-sm text-muted mb-4">{f.desc}</p>
                  <Link
                    href="/signup"
                    className="inline-flex px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-full transition-colors"
                  >
                    Claim Offer
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
