import Hero from "@/components/marketing/Hero";
import Logos from "@/components/marketing/Logos";
import Stats from "@/components/marketing/Stats";
import Features from "@/components/marketing/Features";
import Testimonials from "@/components/marketing/Testimonials";
import Pricing from "@/components/marketing/Pricing";
import Awards from "@/components/marketing/Awards";
import FAQ from "@/components/marketing/FAQ";

export default function MarketingPage() {
  return (
    <>
      {/* 1. Hero + Video/About */}
      <Hero />
      {/* 2. Trusted by 210k+ (logos grid) */}
      <Logos />
      {/* 3. Stats metrics */}
      <Stats />
      {/* 4. One Platform Carousel + End-to-End Funnel */}
      <Features />
      {/* 5. Testimonials with video cards */}
      <Testimonials />
      {/* 6. Pricing with per-message rates */}
      <Pricing />
      {/* 7. Awards & G2 Badges */}
      <Awards />
      {/* 8. FAQ */}
      <FAQ />
    </>
  );
}
