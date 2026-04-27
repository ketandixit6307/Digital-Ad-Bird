"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaBolt, FaEye, FaEyeSlash, FaCreditCard, FaLock, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  
  const planParam = (searchParams.get("plan") as "basic" | "pro") || "basic";
  const billingParam = (searchParams.get("billing") as "monthly" | "quarterly") || "monthly";
  
  const price = planParam === "pro" ? 2999 : 1395;
  const finalPrice = billingParam === "quarterly" ? price * 3 * 0.7 : price; 
  const total = finalPrice + Math.round(finalPrice * 0.18);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // After they submit the form, show the payment modal
    setShowPayment(true);
  };

  const processPayment = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Simulate payment processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Hit the register endpoint with the selected plan
      const res = await api.post("/auth/register", {
        ...formData,
        plan: planParam,
      });
      
      localStorage.setItem("accessToken", res.data.data.accessToken);
      setUser(res.data.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      setShowPayment(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Payment Modal that appears after clicking Create Account */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] shadow-2xl max-w-[850px] w-full flex overflow-hidden relative animate-in fade-in zoom-in duration-200" style={{ height: '550px' }}>
            
            {/* Left Panel - Green */}
            <div className="w-[340px] bg-[#00D26A] flex flex-col relative shrink-0">
              {/* Header */}
              <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-700/20 flex items-center justify-center text-green-900 font-bold text-lg">
                  A
                </div>
                <span className="text-black font-bold tracking-wide">AISENSY COMMUNICA...</span>
              </div>
              
              {/* Price Box */}
              <div className="px-6">
                <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
                  <p className="text-gray-500 text-sm mb-1">Price Summary</p>
                  <p className="text-3xl font-bold text-gray-900">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
                
                {/* Contact Info Box */}
                <div className="bg-white rounded-xl p-4 shadow-sm mb-3 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">Using as +91 09565</p>
                      <p className="text-sm text-gray-800">369151</p>
                    </div>
                  </div>
                  <span className="text-gray-400">&gt;</span>
                </div>
                
                {/* Offers Box */}
                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xs font-bold border border-red-100">%</div>
                    <span className="text-sm text-gray-800">Offers on UPI, Card and Emi</span>
                  </div>
                  <span className="text-gray-400">&gt;</span>
                </div>
              </div>
              
              {/* Decorative graphic at bottom */}
              <div className="mt-auto relative h-40 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <p className="text-green-900/80 text-xs font-semibold flex items-center gap-1">
                    Secured by <span className="font-extrabold text-black italic text-sm">Razorpay</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - White */}
            <div className="flex-1 bg-white flex flex-col">
              {/* Header */}
              <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
                <span className="font-semibold text-gray-700">Payment Options</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-xl pb-2">...</span>
                  <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600">
                    <span className="text-xl">&times;</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Options Sidebar */}
                <div className="w-48 border-r border-gray-100 flex flex-col pt-2 bg-gray-50/30">
                  {/* UPI - Active */}
                  <div className="px-4 py-4 bg-green-50 border-l-4 border-[#00D26A] cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 text-sm">UPI</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Upto 1.5% savings...</span>
                  </div>
                  
                  {/* Cards */}
                  <div className="px-4 py-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-700 text-sm">Cards</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-3 bg-blue-600 rounded-sm"></div>
                        <div className="w-4 h-3 bg-red-500 rounded-sm"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Upto 1.5% savings...</span>
                  </div>

                  {/* EMI */}
                  <div className="px-4 py-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-700 text-sm">EMI</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Upto 1.5% savings...</span>
                  </div>

                  {/* Netbanking */}
                  <div className="px-4 py-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-700 text-sm">Netbanking</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Wallet */}
                  <div className="px-4 py-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-700 text-sm">Wallet</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Action Area (QR Code) */}
                <div className="flex-1 p-6 relative">
                  {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                      <FaSpinner className="h-10 w-10 animate-spin text-[#00D26A] mb-4" />
                      <p className="text-gray-800 font-medium">Processing payment securely...</p>
                    </div>
                  )}
                  
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Available Offers</h4>
                  <div className="bg-[#e8fbf1] border border-green-100 rounded-xl p-3 mb-6 flex items-center gap-3">
                    <div className="bg-white rounded p-1 shadow-sm"><span className="text-red-500 font-bold text-xs">%</span></div>
                    <span className="text-sm font-medium text-green-800">Upto 1.5% savings with NeuCard UPI txn</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-600">UPI QR</h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full border border-gray-400 text-[8px] flex items-center justify-center">L</span>
                      11:52
                    </span>
                  </div>

                  {/* QR Box - Clicking this triggers the payment success */}
                  <div 
                    onClick={processPayment}
                    className="bg-gray-50 rounded-2xl p-6 flex gap-6 items-center cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-[#00D26A]/30 group relative"
                  >
                    <div className="w-32 h-32 bg-white rounded-xl p-2 shadow-sm shrink-0">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=simulate_payment_${Date.now()}`} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Scan the QR using any UPI App</p>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-blue-500 shadow-sm"></div>
                        <div className="w-6 h-6 rounded-full bg-green-500 shadow-sm"></div>
                        <div className="w-6 h-6 rounded-full bg-purple-500 shadow-sm"></div>
                        <div className="w-6 h-6 rounded-full bg-black shadow-sm"></div>
                      </div>
                      <div className="inline-block text-[11px] font-medium text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-xl">
                        Upto 1.5% savings with NeuCard UPI txns
                      </div>
                    </div>
                    
                    {/* Tooltip to guide user */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Click QR code to simulate successful payment
                    </div>
                  </div>
                  
                  {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form mirroring the exact previous "Digital Ad Bird" style */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <FaBolt className="h-8 w-8 text-primary" fill="currentColor" />
                <span className="text-xl font-bold">Digital Ad Bird</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="text-muted text-sm mt-1">Start your free trial today</p>
            </div>

            {error && !showPayment && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input
                  name="organization"
                  type="text"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 mt-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-muted mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-50"><FaSpinner className="h-8 w-8 animate-spin text-primary" /></div>}>
      <CheckoutForm />
    </Suspense>
  );
}
