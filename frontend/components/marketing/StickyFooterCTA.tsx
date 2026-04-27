"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function getTargetTime() {
  // 2 hours from first load, but reset daily for demo purposes
  const stored = sessionStorage.getItem("saleEnds");
  if (stored) return parseInt(stored);
  const t = Date.now() + 2 * 60 * 60 * 1000;
  sessionStorage.setItem("saleEnds", String(t));
  return t;
}

export default function StickyFooterCTA() {
  const [time, setTime] = useState({ h: "02", m: "00", s: "00" });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = getTargetTime();

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const totalSec = Math.floor(diff / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setTime({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-dark text-white border-t border-gray-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          {/* left: sale ending soon + timer */}
          <div className="flex items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                ⏰ Special Sale Ending Soon
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[time.h, time.m, time.s].map((unit, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="bg-white/10 rounded-md px-2.5 py-1 text-lg font-mono font-bold tabular-nums">
                      {unit}
                    </span>
                    {i < 2 && <span className="text-gray-400 font-bold text-lg">:</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* center: CTA */}
          <Link
            href="/signup"
            className="px-8 py-3 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-full transition-colors whitespace-nowrap shrink-0"
          >
            GET NEW YEAR OFFER From ₹2,500 ₹1,395
          </Link>

          {/* close */}
          <button
            onClick={() => setHidden(true)}
            className="absolute top-2 right-4 text-gray-400 hover:text-white text-xl leading-none sm:static sm:ml-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
