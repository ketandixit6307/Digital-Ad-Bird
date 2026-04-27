import MarketingNav from "@/components/layout/MarketingNav";
import MarketingFooter from "@/components/layout/MarketingFooter";
import PromoPopup from "@/components/marketing/PromoPopup";
import StickyFooterCTA from "@/components/marketing/StickyFooterCTA";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNav />
      <PromoPopup />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
      <StickyFooterCTA />
    </>
  );
}
