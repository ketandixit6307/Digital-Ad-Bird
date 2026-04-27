"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const allTestimonials = [
  [
    { name: "Rahul Sharma", company: "FashionHub India", role: "CEO", quote: "Digital Ad Bird helped us 3x our sales in just 2 months. The WhatsApp campaigns are incredibly effective.", hasVideo: true },
    { name: "Priya Patel", company: "HealthFirst Clinics", role: "Marketing Head", quote: "The automation features saved us countless hours. Our patient engagement has never been better.", hasVideo: true },
    { name: "Amit Kumar", company: "AutoCare Plus", role: "Founder", quote: "Best investment we made this year. ROI on WhatsApp marketing is unmatched.", hasVideo: false },
    { name: "Sunita Gupta", company: "EduLearn Pro", role: "Growth Lead", quote: "We recovered 40% of abandoned enrollments using automated WhatsApp reminders.", hasVideo: true },
  ],
  [
    { name: "Vikram Singh", company: "RetailFirst", role: "Director", quote: "Broadcast campaigns generate 5x more engagement than email. Phenomenal platform.", hasVideo: true },
    { name: "Meera Nair", company: "BeautyBox India", role: "CMO", quote: "Click to WhatsApp Ads brought us 3x more leads at half the cost of regular ads.", hasVideo: false },
    { name: "Rajan Shah", company: "FinTrack App", role: "Co-founder", quote: "The API integrations with our CRM were seamless. Support team is outstanding.", hasVideo: true },
    { name: "Ananya Roy", company: "TravelDeals", role: "Head of Sales", quote: "We use retargeting to convert abandoned bookings. Revenue increased by 60%.", hasVideo: true },
  ],
];

const ratings = [
  { platform: "Google", score: "5.0", count: "870+", color: "text-blue-600" },
  { platform: "G2", score: "5.0", count: "65+", color: "text-orange-500" },
];

export default function Testimonials() {
  const [page, setPage] = useState(0);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
            Customer Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            See What Our Customers Have to Say
          </h2>
          <p className="text-muted text-sm max-w-xl mx-auto mb-6">
            Real businesses, real results. Hear directly from our customers about their success with Digital Ad Bird.
          </p>

          {/* Google & G2 ratings */}
          <div className="flex flex-wrap justify-center gap-6">
            {ratings.map((r) => (
              <div key={r.platform} className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                <span className={`text-sm font-bold ${r.color}`}>{r.platform}</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-dark">{r.score}</span>
                <span className="text-xs text-muted">({r.count} reviews)</span>
              </div>
            ))}
          </div>
        </div>

        {/* testimonial cards grid */}
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {allTestimonials[page].map((t) => (
            <div
              key={t.name}
              className="bg-cream rounded-2xl overflow-hidden border border-cream-border group cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* video thumbnail area */}
              <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FaPlay className="h-5 w-5 text-primary fill-primary ml-0.5" />
                </div>
                {t.hasVideo && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-xs bg-primary text-white rounded-full font-medium">
                    Video
                  </span>
                )}
              </div>

              {/* content */}
              <div className="p-5">
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="text-sm font-semibold text-dark">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* carousel nav */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => (p === 0 ? allTestimonials.length - 1 : p - 1))}
            className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {allTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all ${i === page ? "w-8 bg-primary" : "w-2 bg-gray-300"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setPage((p) => (p === allTestimonials.length - 1 ? 0 : p + 1))}
            className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
