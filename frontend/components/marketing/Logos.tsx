"use client";

import { motion } from "framer-motion";

const companies = [
  "Wipro", "Tata", "PayU", "Asian Paints", "Godrej", "Turtlemint",
  "Bajaj Finance", "TP-Link", "Cargill", "PhysicsWallah", "Aditya Birla",
  "HomeLane", "Vivo", "People Matter", "The Indian Express", "Quikr",
  "Flipkart", "OYO", "Zomato", "Paytm", "HDFC Bank", "ICICI Bank",
  "MakeMyTrip", "PolicyBazaar", "Nykaa", "Meesho", "Dream11", "Razorpay",
  "Swiggy", "Urban Company", "Cars24", "Byju's", "Unacademy", "Zepto",
  "Dunzo", "Blinkit", "ShareChat", "Vedantu", "Groww", "Zerodha",
];

export default function Logos() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-2">
            Trusted by 210,000+ Businesses Worldwide
          </h2>
          <p className="text-muted text-sm">
            Join the world&apos;s leading brands already on Digital Ad Bird
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3"
        >
          {companies.map((company, i) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="flex items-center justify-center px-3 py-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/30 hover:bg-primary-light transition-all"
            >
              <span className="text-xs font-semibold text-gray-500 text-center leading-tight">
                {company}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
