"use client";

import { motion } from "framer-motion";

const g2Awards = [
  { label: "Best Software", emoji: "🏆" },
  { label: "Leader", emoji: "👑" },
  { label: "High Performer", emoji: "⚡" },
  { label: "Momentum Leader", emoji: "🚀" },
  { label: "Best Results", emoji: "🎯" },
  { label: "Easiest To Use", emoji: "✨" },
  { label: "Best Support", emoji: "💬" },
  { label: "Users Love Us", emoji: "❤️" },
];

const events = [
  { city: "Mumbai", attendees: "1,200+", year: "2024" },
  { city: "Delhi", attendees: "2,000+", year: "2024" },
  { city: "Bangalore", attendees: "900+", year: "2024" },
  { city: "Hyderabad", attendees: "700+", year: "2023" },
  { city: "Chennai", attendees: "600+", year: "2023" },
  { city: "Pune", attendees: "500+", year: "2023" },
  { city: "Kolkata", attendees: "450+", year: "2023" },
  { city: "Singapore", attendees: "800+", year: "2024" },
];

export default function Awards() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="text-center mb-14">
          <span className="text-3xl mb-3 block">✨ 🏆 🎉</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            Awarded by WhatsApp for 3 Consecutive Years
          </h2>
          <p className="text-muted text-sm max-w-xl mx-auto">
            Recognized by industry leaders and trusted by businesses worldwide
          </p>
        </div>

        {/* G2 award badges */}
        <div className="mb-16">
          <h3 className="text-center text-sm font-semibold text-muted uppercase tracking-wider mb-8">
            G2 Awards & Recognition
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {g2Awards.map((award, i) => (
              <motion.div
                key={award.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-primary/20 bg-primary-light hover:border-primary transition-colors text-center"
              >
                <span className="text-4xl">{award.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-dark leading-snug">{award.label}</p>
                  <p className="text-xs text-primary font-semibold mt-0.5">G2 Award</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* events section */}
        <div className="bg-cream rounded-3xl p-10 border border-cream-border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-dark mb-2">Trusted by Industry Leaders</h3>
            <p className="text-muted text-sm">
              Hosted 10+ events across 7 Indian cities and 2 countries
            </p>
            <p className="text-xs text-muted mt-1">
              Flagship Event: <span className="font-semibold text-dark">Evolve&apos;24: Delhi edition</span> — featuring Vijay Shekhar Sharma, Mukul Rustagi & more
            </p>
            <a
              href="#"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              Evolve&apos;25 AI Edition – October 28, 2025 →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {events.map((e, i) => (
              <motion.div
                key={e.city}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="bg-white rounded-2xl p-5 text-center border border-gray-100"
              >
                <p className="text-lg font-bold text-dark">{e.city}</p>
                <p className="text-2xl font-extrabold text-primary mt-1">{e.attendees}</p>
                <p className="text-xs text-muted">attendees · {e.year}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
