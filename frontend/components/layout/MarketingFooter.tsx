import Link from "next/link";
import { FaBolt } from "react-icons/fa";

export default function MarketingFooter() {
  return (
    <footer className="bg-dark text-gray-400 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <FaBolt className="h-4 w-4 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold text-white">Digital Ad Bird</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              AI-Powered WhatsApp Engagement Platform for modern businesses. Official WhatsApp Business Solution Provider.
            </p>
            <div className="mt-4 flex gap-3">
              {["G2", "Google", "WhatsApp BSP"].map((badge) => (
                <span key={badge} className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded-md text-gray-400">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Digital Ad Bird. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Official WhatsApp Business Solution Provider
          </p>
        </div>
      </div>
    </footer>
  );
}
