"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  { q: "After payment, how will the setup happen? How much time will it take?", a: "Setup is instant. Once payment is confirmed, you can start using the platform immediately. WhatsApp Business API verification may take 1-3 business days." },
  { q: "What is WhatsApp's new per-template message pricing?", a: "Marketing messages cost ₹1.09/msg and utility messages cost ₹0.145/msg for Indian numbers as of January 2026." },
  { q: "Can anyone help me build my Chatbot?", a: "Yes! We provide a drag-and-drop chatbot builder with automated responses. Our support team can also help you set up custom flows." },
  { q: "What is 14-Day Money Back Guarantee?", a: "If you're not satisfied within 14 days, contact our support for a full refund. No questions asked." },
  { q: "Will my number get blocked? Is this via Official WhatsApp API?", a: "Yes, we use the official WhatsApp Business API. Your number will not get blocked as long as you follow WhatsApp's commerce policy." },
  { q: "Do I need a new phone number or can I use WhatsApp Business app's number?", a: "You can migrate your existing WhatsApp Business number to the API. The process is seamless and takes a few minutes." },
  { q: "How to get Blue tick account? Is it included or is there extra charge?", a: "Blue tick (Official Business Account) application is included free with all plans. Approval is subject to Meta's verification process." },
  { q: "Will I get good customer support? What are the ways you support?", a: "We offer 24/7 chat support, email support, and dedicated account managers for Pro plans." },
  { q: "How many messages can I send in a day?", a: "There's no daily limit on the number of messages. You only pay per message sent based on your plan." },
  { q: "How do Upgrade or Downgrade work?", a: "You can upgrade or downgrade anytime from your billing dashboard. Changes take effect at the next billing cycle." },
  { q: "Is there any WhatsApp Business API procurement fee for a brand/business?", a: "No, WhatsApp Business API is completely free with all our plans. We handle the setup at no extra cost." },
  { q: "How do you handle Customer Support?", a: "We provide 24/7 live chat, email support, comprehensive documentation, and video tutorials." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-muted">Everything you need to know about Digital Ad Bird</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <FaChevronDown className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
