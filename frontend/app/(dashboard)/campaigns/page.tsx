"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaPlay, FaTimesCircle } from "react-icons/fa";
import api from "@/lib/api";

interface Campaign {
  _id: string;
  name: string;
  targetTags: string[];
  messageTemplate: string;
  status: string;
  stats: { total: number; sent: number; failed: number };
  scheduledAt?: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { fetchCampaigns(); }, []);

  async function fetchCampaigns() {
    setLoading(true);
    try {
      const res = await api.get("/campaigns");
      setCampaigns(res.data.data.campaigns);
    } finally { setLoading(false); }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await api.post("/campaigns", {
      name: form.get("name"),
      messageTemplate: form.get("messageTemplate"),
      targetTags: (form.get("targetTags") as string).split(",").map(t => t.trim()).filter(Boolean),
      scheduledAt: form.get("scheduledAt") || undefined,
    });
    setShowAdd(false);
    fetchCampaigns();
  }

  async function handleLaunch(id: string) {
    await api.post(`/campaigns/${id}/launch`);
    fetchCampaigns();
  }

  async function handleCancel(id: string) {
    await api.post(`/campaigns/${id}/cancel`);
    fetchCampaigns();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-muted text-sm">Create and manage bulk messaging campaigns</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors flex items-center gap-2 self-start"
        >
          <FaPlus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Create Campaign</h3>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
            <input name="name" placeholder="Campaign Name" required className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" />
            <input name="targetTags" placeholder="Target Tags (comma separated)" className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" />
            <textarea name="messageTemplate" placeholder="Message Template" required rows={3} className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" />
            <input name="scheduledAt" type="datetime-local" className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" />
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl">Create</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center text-muted py-8">Loading...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center text-muted py-8">No campaigns yet</div>
        ) : campaigns.map((c) => (
          <div key={c._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    c.status === "completed" ? "bg-green-50 text-green-600" :
                    c.status === "processing" ? "bg-blue-50 text-blue-600" :
                    c.status === "failed" ? "bg-red-50 text-red-600" :
                    c.status === "cancelled" ? "bg-gray-100 text-gray-600" :
                    "bg-yellow-50 text-yellow-600"
                  }`}>{c.status}</span>
                </div>
                <p className="text-sm text-muted mt-1">{c.messageTemplate.slice(0, 80)}...</p>
                <div className="flex items-center gap-2 mt-2">
                  {c.targetTags.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.status === "draft" && (
                  <button onClick={() => handleLaunch(c._id)} className="px-3 py-2 text-sm font-medium text-white bg-primary rounded-xl flex items-center gap-1">
                    <FaPlay className="h-3 w-3" /> Launch
                  </button>
                )}
                {(c.status === "draft" || c.status === "scheduled") && (
                  <button onClick={() => handleCancel(c._id)} className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl flex items-center gap-1">
                    <FaTimesCircle className="h-3 w-3" /> Cancel
                  </button>
                )}
              </div>
            </div>
            {(c.status === "processing" || c.status === "completed") && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted mb-1">
                  <span>Progress</span>
                  <span>{c.stats.sent} / {c.stats.total} sent</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${c.stats.total ? (c.stats.sent / c.stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
