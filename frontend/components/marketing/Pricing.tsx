"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaShieldAlt, FaChevronDown } from "react-icons/fa";
import Link from "next/link";

const plans = [
  {
    name: "BASIC",
    badge: "30% Off",
    savings: "Save ₹605",
    originalPrice: 2000,
    price: 1395,
    quarterlyPrice: 3780,
    borderColor: "border-primary",
    badgeBg: "bg-primary",
    buttonBg: "bg-primary hover:bg-primary-dark",
    highlight: false,
    messagingRates: [
      { label: "Marketing messages (India)", rate: "₹1.09/msg" },
      { label: "Utility messages (India)", rate: "₹0.145/msg" },
    ],
    featuresVisible: [
      "FREE 500 Ad Credits (one-time)",
      "Free WhatsApp Business API",
      "Free WhatsApp Blue Tick Application",
      "AI Template message generator",
      "Unlimited Broadcasting & Retargeting",
      "Unlimited Free Service Conversations",
      "Click to WhatsApp Ads Manager (3-5x leads)",
    ],
    featuresHidden: [
      "Upload & Manage Contacts",
      "Create tags & attributes (Up to 10 Tags)",
      "Up to 5 Custom Attributes",
      "Create template messages",
      "Live Chat Dashboard",
      "1 Owner + 5 FREE Agents included",
      "Smart Audience Segregation",
      "Template Message APIs",
      "Multi-Agent Live Chat",
      "Agent Transfer & Manager Monitoring",
      "AiSensy Marketplace Integrations",
      "Shopify & WooCommerce Integrations",
      "Shared Team Inbox",
      "WhatsApp Payments",
    ],
    totalFeatures: 21,
  },
  {
    name: "PRO",
    badge: "19% Off",
    savings: "Save ₹701",
    originalPrice: 3700,
    price: 2999,
    quarterlyPrice: 8094,
    borderColor: "border-secondary",
    badgeBg: "bg-secondary",
    buttonBg: "bg-secondary hover:bg-orange-600",
    highlight: true,
    messagingRates: [
      { label: "Marketing messages (India)", rate: "₹1.09/msg" },
      { label: "Utility messages (India)", rate: "₹0.145/msg" },
    ],
    featuresVisible: [
      "Everything in Basic Plan",
      "FREE 500 Ad Credits (one-time)",
      "Up to 100 Tags",
      "Up to 20 Custom Attributes",
      "Campaign Scheduler",
      "Campaign Click Tracking",
      "Smart Agent Routing",
    ],
    featuresHidden: [
      "Campaign Budget Analytics",
      "Project APIs",
      "Custom Agent Rules",
      "Carousel Template Click Tracking",
      "CSV Campaign Scheduler",
      "User Access Control",
      "Automatic Failed Message Retry",
      "1 Owner + 5 FREE Agents included",
    ],
    totalFeatures: 15,
  },
];

function PlanCard({ plan, billing }: { plan: typeof plans[0]; billing: "monthly" | "quarterly" }) {
  const [expanded, setExpanded] = useState(false);
  const price = billing === "quarterly" ? plan.quarterlyPrice : plan.price;
  const period = billing === "quarterly" ? "3 months" : "month";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-3xl border-2 ${plan.borderColor} bg-white p-8`}
    >
      {/* badge */}
      <div className="absolute -top-3.5 left-8">
        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${plan.badgeBg}`}>
          {plan.badge}
        </span>
      </div>

      {/* plan name */}
      <div className="mt-2 mb-1">
        <h3 className="text-base font-bold text-dark">{plan.name}</h3>
        <p className="text-xs text-muted">{plan.savings}</p>
      </div>

      {/* messaging rates */}
      <div className="my-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
        <p className="text-xs font-semibold text-muted mb-2">Messaging (India)</p>
        {plan.messagingRates.map((r) => (
          <div key={r.label} className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{r.label}</span>
            <span className="font-semibold text-dark">{r.rate}</span>
          </div>
        ))}
      </div>

      {/* price */}
      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold text-dark">₹{price.toLocaleString("en-IN")}</span>
        <span className="text-sm text-muted">(+ GST)</span>
      </div>
      <div className="text-sm text-gray-400 line-through mb-1">₹{plan.originalPrice.toLocaleString("en-IN")}</div>
      <div className="text-xs text-muted mb-6">Billed per {period}</div>

      {/* money back */}
      <div className="flex items-center gap-1.5 text-xs text-muted mb-5">
        <FaShieldAlt className="h-3.5 w-3.5 text-primary shrink-0" />
        <span>14-Day Money-Back Guarantee, No Questions Asked</span>
      </div>

      {/* CTA */}
      <Link
        href={`/checkout?plan=${plan.name.toLowerCase()}&billing=${billing}`}
        className={`block w-full text-center py-3.5 text-sm font-bold text-white rounded-full transition-colors mb-8 ${plan.buttonBg}`}
      >
        Get Offer Now
      </Link>

      {/* visible features */}
      <div className="space-y-2.5">
        {plan.featuresVisible.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <div className="h-4 w-4 rounded-full bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
              <FaCheck className="h-2.5 w-2.5 text-primary" />
            </div>
            <span className="text-xs text-gray-600">{f}</span>
          </div>
        ))}
      </div>

      {/* expandable features */}
      {plan.featuresHidden.length > 0 && (
        <>
          {expanded && (
            <div className="mt-2.5 space-y-2.5">
              {plan.featuresHidden.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                    <FaCheck className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <span className="text-xs text-gray-600">{f}</span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            {expanded ? "View less" : `View all ${plan.totalFeatures} features`}
            <FaChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </>
      )}

      {/* additional agents note */}
      <p className="mt-4 text-xs text-muted border-t border-gray-100 pt-4">
        Additional agents at <span className="font-semibold text-dark">₹750/month</span> per agent
      </p>
    </motion.div>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "quarterly">("monthly");

  return (
    <section id="pricing" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
            🎁 Limited Time Special Offer
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Special Pricing</h2>
          <p className="text-muted text-sm max-w-lg mx-auto">
            Get started with Digital Ad Bird at unbeatable WhatsApp engagement prices
          </p>
        </div>

        {/* billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billing === "monthly" ? "bg-dark text-white shadow" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("quarterly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billing === "quarterly" ? "bg-dark text-white shadow" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Quarterly
              <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full font-semibold">
                SAVE 30%
              </span>
            </button>
          </div>
        </div>

        {/* plan cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} billing={billing} />
          ))}
        </div>
      </div>
    </section>
  );
}
