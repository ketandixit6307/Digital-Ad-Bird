"use client";

import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await api.put(`/auth/me`, {
        name: form.get("name"),
        organization: form.get("organization"),
      });
      setUser(res.data.data.user);
      setMessage("Profile updated successfully");
    } catch {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-muted text-sm">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Profile Information</h3>
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="name"
              defaultValue={user?.name}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              value={user?.email}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <input
              name="organization"
              defaultValue={user?.organization}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <FaSave className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Integrations</h3>
        <p className="text-sm text-gray-500 mb-6">Connect third-party apps to sync your data automatically.</p>
        
        <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Facebook Ads</h4>
              <p className="text-xs text-gray-500">Sync lead generation forms directly to your contacts.</p>
            </div>
          </div>
          
          {(user as any)?.facebookAccessToken ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Connected
              </span>
              <button 
                onClick={async () => {
                  try {
                    const res = await api.post("/auth/facebook-token", { accessToken: null, pageId: null });
                    setUser(res.data.data.user);
                  } catch (e) {}
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={async () => {
                const token = prompt("Enter your Meta App Access Token (Simulation):", "EAAGm0PX...mock_token");
                if (token) {
                  try {
                    const res = await api.post("/auth/facebook-token", { accessToken: token, pageId: "mock_page_id" });
                    setUser(res.data.data.user);
                    alert("Facebook Ads successfully connected!");
                  } catch (e) {
                    alert("Failed to connect Facebook.");
                  }
                }
              }}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              Connect App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
