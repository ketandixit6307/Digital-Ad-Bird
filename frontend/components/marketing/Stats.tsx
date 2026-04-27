"use client";

import { motion } from "framer-motion";
import { FaUsers, FaRegComment, FaGlobe, FaChartLine } from "react-icons/fa";

const stats = [
  { icon: FaUsers, value: "2,10,000+", label: "Businesses Onboarded", emoji: "❄️" },
  { icon: FaRegComment, value: "700Cr+", label: "WhatsApp Messages Sent", emoji: "🎄" },
  { icon: FaGlobe, value: "60+", label: "Countries Worldwide", emoji: "⛄" },
  { icon: FaChartLine, value: "₹7B+", label: "Revenue Generated", emoji: "🚀" },
];

export default function Stats() {
  return (
    <section className="bg-cream py-16 border-y border-cream-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-2xl mb-2">❄️ 🎄 ⛄</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-dark">
            Trusted by Businesses Worldwide
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
            >
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <div className="text-3xl font-extrabold text-dark">{stat.value}</div>
              <div className="text-xs text-muted mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
