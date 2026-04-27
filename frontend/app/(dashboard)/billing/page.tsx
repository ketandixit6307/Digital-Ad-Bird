"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaArrowRight, FaSpinner, FaCreditCard, FaMobileAlt, FaShieldAlt, FaBuilding } from "react-icons/fa";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";

interface Plan {
  name: string;
  slug: string;
  price: number;
  features: string[];
  limits: Record<string, number>;
}

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const { user, setUser } = useAuthStore();
  const [showPayment, setShowPayment] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentError, setPaymentError] = useState("");
  const [activeTab, setActiveTab] = useState("UPI");
  const [showSuccess, setShowSuccess] = useState(false);

  const [paymentStep, setPaymentStep] = useState<"options" | "processing" | "otp" | "success" | "cancelling">("options");

  useEffect(() => {
    api.get("/billing/plans").then((res) => setPlans(res.data.data));
  }, []);

  async function handleCheckout(plan: Plan) {
    setSelectedPlan(plan);
    setShowPayment(true);
    setActiveTab("UPI");
    setPaymentStep("options");
    setShowSuccess(false);
    setPaymentError("");
  }

  async function simulateTransaction(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!selectedPlan) return;
    
    setPaymentStep("processing");
    setPaymentError("");
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPaymentStep("success");
    
    // Then finish applying the plan to the account
    setTimeout(async () => {
      try {
        const res = await api.post("/billing/simulate-payment", { planSlug: selectedPlan.slug });
        setUser(res.data.data.user);
        setShowPayment(false);
        setPaymentStep("options");
      } catch (err: any) {
        setPaymentError(err.response?.data?.message || "Payment failed");
        setPaymentStep("options");
      }
    }, 1500);
  }

  async function handlePortal() {
    const res = await api.post("/billing/portal");
    window.location.href = res.data.data.url;
  }

  const formatPrice = (priceInPaise: number) => {
    return priceInPaise / 100;
  };

  return (
    <div className="space-y-8 font-sans relative">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-muted text-sm">Manage your subscription</p>
      </div>

      {user?.currentPlan && user.currentPlan !== 'free' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 bg-green-50/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                Current Plan
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Active</span>
              </h3>
              <p className="text-sm text-muted capitalize text-green-800 font-medium">{user.currentPlan}</p>
            </div>
            {user.stripeCustomerId && (
              <button onClick={handlePortal} className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-xl hover:bg-green-50 transition-colors">
                Manage Subscription
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div key={plan.slug} className={`rounded-3xl border-2 ${plan.slug === "pro" ? "border-secondary bg-white" : "border-primary bg-white"} p-8 relative transition-all`}>
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{formatPrice(plan.price).toLocaleString()}</span>
              <span className="text-muted text-sm">/month</span>
            </div>
            <button
              onClick={() => handleCheckout(plan)}
              className={`w-full py-3 text-sm font-semibold text-white rounded-full transition-colors ${plan.slug === "pro" ? "bg-secondary hover:bg-orange-600" : "bg-primary hover:bg-primary-dark"}`}
            >
              Get Started
              <FaArrowRight className="h-4 w-4 inline ml-1" />
            </button>
            <div className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <FaCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Razorpay Interactive Simulation Modal */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-black/75 z-[100] flex items-center justify-center p-0 sm:p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-none sm:rounded-[16px] shadow-2xl max-w-[850px] w-full flex flex-col sm:flex-row overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 h-full sm:h-[550px]">
            
            {/* Cancel Confirmation Overlay */}
            {paymentStep === "cancelling" && (
              <div className="absolute inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Payment?</h3>
                  <p className="text-sm text-gray-500 mb-6">If you cancel now, your transaction will be aborted and no charges will be made.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setPaymentStep("options")} className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                      No, Continue
                    </button>
                    <button onClick={() => setShowPayment(false)} className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700">
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bank OTP Overlay Screen */}
            {paymentStep === "otp" && (
              <div className="absolute inset-0 bg-white z-[60] flex flex-col items-center justify-center animate-in slide-in-from-right duration-300">
                <div className="max-w-md w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden m-4">
                  <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <span className="font-bold text-lg tracking-wider">SECURE BANKING</span>
                    <FaShieldAlt className="w-6 h-6" />
                  </div>
                  <div className="p-6 bg-white space-y-4">
                    <p className="text-sm text-gray-600">Please authenticate the payment of <strong className="text-gray-900">₹{formatPrice(selectedPlan.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong> to <strong>DIGITAL AD BIRD</strong>.</p>
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-xs text-yellow-800">
                      An OTP has been sent to your registered mobile number ending in **{Math.floor(Math.random() * 9000) + 1000}**.
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Enter OTP</label>
                      <input type="text" placeholder="• • • • • •" maxLength={6} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 outline-none text-center tracking-[0.5em] sm:tracking-[1em] font-mono text-lg" autoFocus />
                    </div>
                    <button onClick={() => {
                      setPaymentStep("processing");
                      setTimeout(() => setPaymentStep("success"), 1500);
                      setTimeout(async () => {
                        const res = await api.post("/billing/simulate-payment", { planSlug: selectedPlan.slug });
                        setUser(res.data.data.user);
                        setShowPayment(false);
                      }, 3000);
                    }} className="w-full py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition-colors">
                      Submit OTP
                    </button>
                    <p className="text-center text-xs text-blue-600 cursor-pointer hover:underline mt-2">Resend OTP</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Overlay Screen */}
            {paymentStep === "success" && (
              <div className="absolute inset-0 bg-white z-[60] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <FaCheck className="w-10 h-10 sm:w-12 sm:h-12 text-[#00D26A] stroke-[3]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payment Successful</h2>
                <p className="text-gray-500 px-6 text-center">Your subscription has been securely activated.</p>
                <p className="text-sm text-gray-400 mt-8">Redirecting to dashboard...</p>
              </div>
            )}

            {/* Left Panel - Green */}
            <div className="w-full sm:w-[340px] bg-[#00D26A] flex flex-col relative shrink-0 h-auto sm:h-full py-4 sm:py-0">
              <div className="p-4 sm:p-6 flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-700/20 flex items-center justify-center text-green-900 font-bold text-base sm:text-lg uppercase">
                    {user?.name?.[0] || 'D'}
                  </div>
                  <span className="text-black font-bold tracking-wide text-sm sm:text-base">DIGITAL AD BIRD</span>
                </div>
                <button onClick={() => setPaymentStep("cancelling")} className="sm:hidden text-green-900 p-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              
              <div className="px-4 sm:px-6 flex sm:flex-col gap-3 sm:gap-0">
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-3 flex-1 sm:flex-none">
                  <p className="text-gray-500 text-[10px] sm:text-sm mb-1">Price Summary</p>
                  <p className="text-lg sm:text-3xl font-bold text-gray-900">₹{formatPrice(selectedPlan.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
                
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-3 flex items-center justify-between flex-1 sm:flex-none">
                  <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] sm:text-sm text-gray-800 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto relative h-12 sm:h-40 overflow-hidden hidden sm:block">
                <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <p className="text-green-900/80 text-xs font-semibold flex items-center gap-1">
                    Secured by <span className="font-extrabold text-black italic text-sm">Razorpay</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - White */}
            <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
              {/* Header - Desktop only */}
              <div className="hidden sm:flex h-16 border-b border-gray-100 items-center justify-between px-6 shrink-0">
                <span className="font-semibold text-gray-700">Payment Options</span>
                <button onClick={() => setPaymentStep("cancelling")} className="text-gray-400 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col sm:flex-row overflow-hidden">
                {/* Options Sidebar - Horizontal on mobile */}
                <div className="w-full sm:w-48 border-r border-b sm:border-b-0 border-gray-100 flex flex-row sm:flex-col pt-0 sm:pt-2 bg-gray-50/30 overflow-x-auto sm:overflow-y-auto shrink-0">
                  <div onClick={() => setActiveTab("UPI")} className={`px-4 py-3 sm:py-4 cursor-pointer transition-colors border-b-4 sm:border-b-0 sm:border-l-4 flex-1 sm:flex-none flex items-center sm:block gap-2 whitespace-nowrap ${activeTab === "UPI" ? "bg-green-50 border-[#00D26A] text-[#00D26A]" : "hover:bg-gray-100 border-transparent text-gray-500"}`}>
                    <div className="flex items-center justify-between mb-0 sm:mb-1 gap-2">
                      <span className="font-semibold text-sm">UPI</span>
                      <FaMobileAlt className="w-4 h-4 hidden sm:block" />
                    </div>
                    <span className="hidden sm:inline-block text-[10px] font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Best value</span>
                  </div>
                  
                  <div onClick={() => setActiveTab("Cards")} className={`px-4 py-3 sm:py-4 cursor-pointer transition-colors border-b-4 sm:border-b-0 sm:border-l-4 flex-1 sm:flex-none flex items-center sm:block gap-2 whitespace-nowrap ${activeTab === "Cards" ? "bg-green-50 border-[#00D26A] text-[#00D26A]" : "hover:bg-gray-100 border-transparent text-gray-500"}`}>
                    <div className="flex items-center justify-between mb-0 sm:mb-1 gap-2">
                      <span className="font-medium text-sm">Cards</span>
                      <FaCreditCard className="w-4 h-4 hidden sm:block" />
                    </div>
                  </div>

                  <div onClick={() => setActiveTab("Netbanking")} className={`px-4 py-3 sm:py-4 cursor-pointer transition-colors border-b-4 sm:border-b-0 sm:border-l-4 flex-1 sm:flex-none flex items-center sm:block gap-2 whitespace-nowrap ${activeTab === "Netbanking" ? "bg-green-50 border-[#00D26A] text-[#00D26A]" : "hover:bg-gray-100 border-transparent text-gray-500"}`}>
                    <div className="flex items-center justify-between mb-0 sm:mb-1 gap-2">
                      <span className="font-medium text-sm">Banks</span>
                      <FaBuilding className="w-4 h-4 hidden sm:block" />
                    </div>
                  </div>
                </div>

                {/* Main Action Area */}
                <div className="flex-1 p-4 sm:p-6 relative overflow-y-auto">
                  {paymentStep === "processing" && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                      <FaSpinner className="h-10 w-10 animate-spin text-[#00D26A] mb-4" />
                      <p className="text-gray-800 font-medium">Processing...</p>
                    </div>
                  )}
                  
                  <div className="bg-[#e8fbf1] border border-green-100 rounded-xl p-3 mb-6 flex items-center gap-3">
                    <div className="bg-white rounded p-1 shadow-sm"><span className="text-red-500 font-bold text-xs">%</span></div>
                    <span className="text-xs sm:text-sm font-medium text-green-800">Upto 1.5% savings available</span>
                  </div>

                  {activeTab === "UPI" && (
                    <div className="animate-in fade-in duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">UPI QR</h4>
                        <span className="text-[10px] text-gray-500">Scan to pay</span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 items-center border border-gray-100 mb-6">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-xl p-2 shadow-sm shrink-0 relative">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=simulate_payment_digital_ad_bird`} alt="UPI QR Code" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-transparent cursor-pointer" onClick={() => setPaymentStep("otp")}></div>
                        </div>
                        
                        <div className="text-center lg:text-left">
                          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Scan using any UPI App</p>
                          <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 opacity-70">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 shadow-sm flex items-center justify-center text-white text-[6px] sm:text-[8px] font-bold">GPay</div>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-600 shadow-sm flex items-center justify-center text-white text-[6px] sm:text-[8px] font-bold">Pe</div>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-800 shadow-sm flex items-center justify-center text-white text-[6px] sm:text-[8px] font-bold">Paytm</div>
                          </div>
                          <button onClick={() => setPaymentStep("otp")} className="px-4 py-2 bg-black text-white text-[10px] font-bold rounded-lg hover:bg-gray-800">Simulate Scan</button>
                        </div>
                      </div>

                      <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] font-medium">OR ENTER UPI ID</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                      </div>

                      <form onSubmit={(e) => { e.preventDefault(); setPaymentStep("otp"); }}>
                        <div className="mb-4">
                          <input type="text" placeholder="example@upi" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#00D26A] focus:ring-1 focus:ring-[#00D26A] outline-none text-sm" required />
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-[#00D26A] hover:bg-[#00b85c] text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
                          Pay Now
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === "Cards" && (
                    <div className="animate-in fade-in duration-200 space-y-4">
                      <form onSubmit={(e) => { e.preventDefault(); setPaymentStep("otp"); }} className="space-y-4">
                        <div>
                          <input type="text" placeholder="Card Number" maxLength={19} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#00D26A] outline-none text-sm font-mono" required />
                        </div>
                        <div className="flex gap-4">
                          <input type="text" placeholder="MM/YY" maxLength={5} className="w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#00D26A] outline-none text-sm font-mono" required />
                          <input type="password" placeholder="CVV" maxLength={3} className="w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#00D26A] outline-none text-sm font-mono" required />
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-[#00D26A] hover:bg-[#00b85c] text-white rounded-xl font-bold text-sm transition-colors">
                          Pay ₹{formatPrice(selectedPlan.price).toLocaleString("en-IN")}
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === "Netbanking" && (
                    <div className="animate-in fade-in duration-200 space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                          <div key={bank} onClick={() => setPaymentStep("otp")} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:border-[#00D26A] hover:bg-green-50 transition-colors">
                            <span className="text-[10px] font-bold text-gray-700">{bank}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setPaymentStep("otp")} className="w-full py-3.5 bg-[#00D26A] hover:bg-[#00b85c] text-white rounded-xl font-bold text-sm">
                        Continue to Bank
                      </button>
                    </div>
                  )}

                  {activeTab === "EMI" && (
                    <div className="animate-in fade-in duration-200">
                      <h4 className="text-sm font-semibold text-gray-600 mb-4">Select EMI Option</h4>
                      <div className="space-y-3 mb-6">
                        {['Credit Card EMI', 'Debit Card EMI', 'Cardless EMI'].map((emi) => (
                          <div key={emi} onClick={() => setPaymentStep("otp")} className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#00D26A] hover:bg-green-50/30 transition-colors flex justify-between items-center group">
                            <span className="text-sm font-semibold text-gray-800 group-hover:text-green-800">{emi}</span>
                            <span className="text-[#00D26A] font-bold">&gt;</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {paymentError && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs">{paymentError}</div>}
                </div>
              </div>
              
              {/* Footer - Mobile only */}
              <div className="sm:hidden p-4 border-t border-gray-100 flex justify-center bg-white shrink-0">
                <p className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                  Secured by <span className="font-extrabold text-black italic text-xs">Razorpay</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
