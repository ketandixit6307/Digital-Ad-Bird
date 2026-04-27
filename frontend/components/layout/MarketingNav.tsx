"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaBolt, FaGift } from "react-icons/fa";

export default function MarketingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#about", label: "About Digital Ad Bird" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#pricing", label: "View Offer Plans", icon: FaGift },
    { href: "#faq", label: "FAQs" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md border-cream-border shadow-sm"
          : "bg-cream border-cream-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[73px]">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <FaBolt className="h-5 w-5 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-gray-900">Digital Ad Bird</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-primary"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-[11px] font-bold text-white bg-[#25D366] hover:bg-[#20bd5b] rounded-full transition-colors whitespace-nowrap"
            >
              GET NEW YEAR OFFER From <span className="line-through opacity-70">₹2,500</span> ₹1,395
            </Link>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-cream border-t border-cream-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-primary hover:text-primary-dark"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="block text-sm font-medium text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="block w-full text-center px-5 py-3 text-xs font-bold text-white bg-[#25D366] rounded-full"
              onClick={() => setIsOpen(false)}
            >
              GET NEW YEAR OFFER From <span className="line-through opacity-70">₹2,500</span> ₹1,395
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
