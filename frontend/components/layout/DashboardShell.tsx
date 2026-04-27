"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaThLarge, FaUsers, FaCommentAlt, FaBullhorn, FaFileAlt, FaProjectDiagram, FaCreditCard, FaCog, FaSignOutAlt, FaBars, FaTimes, FaBolt } from "react-icons/fa";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: FaThLarge },
  { href: "/contacts", label: "Contacts", icon: FaUsers },
  { href: "/live-chat", label: "Live Chat", icon: FaCommentAlt },
  { href: "/campaigns", label: "Campaigns", icon: FaBullhorn },
  { href: "/templates", label: "Templates", icon: FaFileAlt },
  { href: "/automation", label: "Automation", icon: FaProjectDiagram },
  { href: "/billing", label: "Billing", icon: FaCreditCard },
  { href: "/settings", label: "FaCog", icon: FaCog },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!user) {
      api.get("/auth/me")
        .then((res) => useAuthStore.getState().setUser(res.data.data.user))
        .catch(() => { logout(); router.push("/login"); });
    }
  }, [user, router, logout]);

  async function handleLogout() {
    try { await api.post("/auth/logout"); } catch {}
    logout();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FaBolt className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="font-bold text-gray-900">Digital Ad Bird</span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-3 px-3">
            <div className="text-sm font-medium text-gray-900">{user?.name || "User"}</div>
            <div className="text-xs text-muted">{user?.email || ""}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:justify-end">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <FaBars className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2.5 py-1 bg-green-50 text-primary rounded-full capitalize">
              {user?.currentPlan || "Free"} Plan
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
