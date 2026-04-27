"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaTrash, FaUpload, FaTag } from "react-icons/fa";
import api from "@/lib/api";

interface Contact {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  status: string;
  source: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { fetchContacts(); }, []);

  async function fetchContacts() {
    setLoading(true);
    try {
      const res = await api.get("/contacts");
      setContacts(res.data.data.contacts);
    } finally { setLoading(false); }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await api.post("/contacts", {
      name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email"),
      tags: (form.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean),
    });
    setShowAdd(false);
    fetchContacts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this contact?")) return;
    await api.delete(`/contacts/${id}`);
    fetchContacts();
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await api.post("/contacts/import-csv", formData, { headers: { "Content-Type": "multipart/form-data" } });
    fetchContacts();
  }

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-muted text-sm">Manage your audience</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-xl hover:bg-green-50 cursor-pointer transition-colors flex items-center gap-2">
            <FaUpload className="h-4 w-4" />
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors flex items-center gap-2"
          >
            <FaPlus className="h-4 w-4" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="FaSearch contacts..."
          className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Add Contact</h3>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
            <input name="name" placeholder="Name" required className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" />
            <input name="phone" placeholder="Phone" required className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" />
            <input name="email" placeholder="Email" className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" />
            <input name="tags" placeholder="Tags (comma separated)" className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none" />
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl">Save</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[600px] lg:min-w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Phone</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600 hidden sm:table-cell">Tags</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600 hidden md:table-cell">Status</th>
              <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted">No contacts found</td></tr>
            ) : filtered.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                <td className="px-6 py-4 text-gray-600">{c.phone}</td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.slice(0, 2).map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-50 text-primary rounded-full">
                        {t}
                      </span>
                    ))}
                    {c.tags.length > 2 && <span className="text-[10px] text-gray-400">+{c.tags.length - 2}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`px-2 py-1 text-xs rounded-full ${c.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-600 p-2">
                    <FaTrash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
