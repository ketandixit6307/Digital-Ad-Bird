"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaPowerOff, FaTrash, FaRobot } from "react-icons/fa";
import api from "@/lib/api";

interface Rule {
  _id: string;
  keyword: string;
  replyMessage: string;
  matchType: "exact" | "includes";
  isActive: boolean;
}

export default function AutomationPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRules(); }, []);

  async function fetchRules() {
    try {
      const res = await api.get("/automation");
      setRules(res.data.data);
    } catch (e) {
      console.error("Failed to fetch rules");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await api.post("/automation", {
        keyword: form.get("keyword"),
        replyMessage: form.get("replyMessage"),
        matchType: form.get("matchType"),
        isActive: true,
      });
      setShowAdd(false);
      fetchRules();
    } catch (e) {
      alert("Failed to add rule");
    }
  }

  async function toggleStatus(id: string, current: boolean) {
    try {
      await api.put(`/automation/${id}`, { isActive: !current });
      fetchRules();
    } catch (e) {}
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this automation rule?")) return;
    try {
      await api.delete(`/automation/${id}`);
      fetchRules();
    } catch (e) {}
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation & AI Chatbot</h1>
          <p className="text-muted text-sm">Create auto-reply rules and manage smart responses</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)} 
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors flex items-center gap-2 self-start shadow-sm"
        >
          <FaPlus className="h-4 w-4" /> New Rule
        </button>
      </div>

      {/* AI Status Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
          <FaRobot className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900">Smart AI Fallback Active</h3>
          <p className="text-sm text-blue-700">If no keyword rule matches, our Smart AI will automatically provide a relevant fallback response to your customers.</p>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-semibold text-gray-900 mb-4">Add Auto-Reply Rule</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 ml-1">Keyword</label>
                <input name="keyword" placeholder='e.g. "price", "hi"' required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 ml-1">Match Type</label>
                <select name="matchType" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                  <option value="exact">Exact Match</option>
                  <option value="includes">Contains Keyword</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 ml-1">Auto-Reply Message</label>
              <textarea name="replyMessage" placeholder="Enter the message customers will receive..." rows={3} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-sm">Save Rule</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="py-10 text-center text-muted">Loading rules...</div>
        ) : rules.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <p className="text-gray-400">No automation rules created yet. Add your first rule above!</p>
          </div>
        ) : (
          rules.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full ${r.isActive ? 'bg-primary' : 'bg-gray-200'}`} />
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">{r.keyword}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${r.matchType === 'exact' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                      {r.matchType}
                    </span>
                    {!r.isActive && <span className="text-[10px] text-gray-400 font-bold uppercase italic">Paused</span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{r.replyMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleStatus(r._id, r.isActive)} 
                  title={r.isActive ? "Pause Rule" : "Activate Rule"}
                  className={`p-2 rounded-lg transition-colors ${r.isActive ? 'text-primary hover:bg-primary/5' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <FaPowerOff className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(r._id)} 
                  title="Delete Rule"
                  className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
