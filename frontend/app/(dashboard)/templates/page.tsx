"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import api from "@/lib/api";

interface Template {
  _id: string;
  name: string;
  body: string;
  category: string;
  status: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { fetchTemplates(); }, []);

  async function fetchTemplates() {
    const res = await api.get("/templates");
    setTemplates(res.data.data);
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await api.post("/templates", {
      name: form.get("name"),
      body: form.get("body"),
      category: form.get("category"),
    });
    setShowAdd(false);
    fetchTemplates();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this template?")) return;
    await api.delete(`/templates/${id}`);
    fetchTemplates();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-muted text-sm">Manage message templates</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors flex items-center gap-2 self-start">
          <FaPlus className="h-4 w-4" /> New Template
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Create Template</h3>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
            <input name="name" placeholder="Template Name" required className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" />
            <select name="category" className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none">
              <option value="marketing">Marketing</option>
              <option value="utility">Utility</option>
              <option value="authentication">Authentication</option>
            </select>
            <textarea name="body" placeholder="Message body..." required rows={4} className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" />
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl">Save</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{t.name}</h3>
                <span className="text-xs text-muted capitalize">{t.category}</span>
              </div>
              <button onClick={() => handleDelete(t._id)} className="text-red-500 hover:text-red-600">
                <FaTrash className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
