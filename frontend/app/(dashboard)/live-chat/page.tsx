"use client";

import { useEffect, useState, useRef } from "react";
import { FaPaperPlane, FaPlus, FaUserPlus } from "react-icons/fa";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/lib/store";

interface Contact {
  _id: string;
  name: string;
  phone: string;
}

interface Message {
  _id: string;
  contactId?: string;
  from: string;
  to: string;
  direction: "inbound" | "outbound";
  content: string;
  createdAt: string;
}

export default function LiveChatPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();

  const fetchContacts = () => {
    api.get("/contacts").then((res) => {
      setContacts(res.data.data.contacts);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchContacts();

    const socket = getSocket();
    
    if (user?._id) {
      socket.emit("join", user._id);
    }

    socket.on("message:received", (msg: Message) => {
      setMessages((prev) => {
        // Prevent duplicate if already fetched
        if (prev.find(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });
    socket.on("message:sent", (msg: Message) => {
      setMessages((prev) => {
        if (prev.find(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => { 
      socket.off("message:received"); 
      socket.off("message:sent"); 
      if (user?._id) {
        socket.emit("leave", user._id);
      }
    };
  }, [user]);

  useEffect(() => {
    if (activeContact) {
      api.get(`/messages?contactId=${activeContact._id}`).then((res) => {
        setMessages(res.data.data.messages.reverse());
      });
    }
  }, [activeContact]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeContact) return;
    
    const content = input;
    setInput("");
    
    try {
      await api.post("/messages/send", { contactId: activeContact._id, content });
      const res = await api.get(`/messages?contactId=${activeContact._id}`);
      setMessages(res.data.data.messages.reverse());
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    
    try {
      const res = await api.post("/contacts", { name: newContactName, phone: newContactPhone });
      fetchContacts();
      setActiveContact(res.data.data);
      setShowAddContact(false);
      setNewContactName("");
      setNewContactPhone("");
    } catch (err) {
      console.error("Failed to add contact", err);
      alert("Failed to add contact. Number might already exist.");
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -m-4 lg:-m-8">
      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Contact</h3>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required value={newContactName} onChange={e => setNewContactName(e.target.value)} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input required value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="+1234567890" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddContact(false)} className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 text-white bg-primary rounded-xl hover:bg-primary-dark">Save & Chat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Contacts sidebar */}
        <div className={`w-full lg:w-72 bg-white border-r border-gray-200 flex flex-col ${activeContact ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
            <button onClick={() => setShowAddContact(true)} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="New Contact">
              <FaUserPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-muted">Loading...</div>
            ) : contacts.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <FaUserPlus className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-muted mb-4">No contacts yet</p>
                <button onClick={() => setShowAddContact(true)} className="text-xs font-semibold text-primary bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100">
                  Add Contact
                </button>
              </div>
            ) : contacts.map((c) => (
              <button
                key={c._id}
                onClick={() => setActiveContact(c)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${activeContact?._id === c._id ? "bg-green-50 border-l-2 border-l-[#00D26A]" : "border-l-2 border-l-transparent"}`}
              >
                <div className="font-medium text-sm text-gray-900 truncate">{c.name}</div>
                <div className="text-xs text-muted truncate">{c.phone}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col bg-[#f0f2f5] relative ${!activeContact ? 'hidden lg:flex' : 'flex'}`}>
          {/* Subtle Chat Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/r_QNOqKA0Xq.png')", backgroundRepeat: 'repeat' }} />
          
          {activeContact ? (
            <div className="flex flex-col h-full relative z-10">
              <div className="px-4 lg:px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setActiveContact(null)}
                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold uppercase shrink-0">
                    {activeContact.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 leading-tight truncate">{activeContact.name}</div>
                    <div className="text-xs text-green-600 font-medium">Online</div>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const msg = prompt("Enter simulated customer message:");
                    if (!msg) return;
                    await api.post("/webhooks/whatsapp", { 
                      phone: activeContact.phone, 
                      message: msg 
                    });
                  }}
                  className="px-3 py-1.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-lg hover:bg-green-100 transition-colors border border-green-200 shadow-sm"
                >
                  Simulate Reply
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-3 scroll-smooth">
                {messages.length === 0 && (
                  <div className="text-center mt-10">
                    <span className="bg-[#ffeecd] text-gray-700 text-xs px-4 py-2 rounded-lg shadow-sm border border-[#ffdb99] inline-block mx-4">
                      Messages and calls are end-to-end encrypted.
                    </span>
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] lg:max-w-md px-3 py-2 rounded-lg text-[14px] shadow-sm relative ${
                      msg.direction === "outbound"
                        ? "bg-[#d9fdd3] text-gray-900 rounded-tr-none"
                        : "bg-white text-gray-900 rounded-tl-none"
                    }`}>
                      <div className="pr-12 pb-1 whitespace-pre-wrap break-words">{msg.content}</div>
                      <div className={`text-[10px] absolute bottom-1 right-2 ${msg.direction === "outbound" ? "text-gray-500" : "text-gray-400"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} className="h-2" />
              </div>
              <form onSubmit={handleSend} className="px-3 lg:px-4 py-3 bg-[#f0f2f5] flex gap-2 shrink-0 z-20">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 px-4 py-3 rounded-xl border-none shadow-sm focus:ring-0 outline-none text-[15px]"
                />
                <button type="submit" disabled={!input.trim()} className="w-12 h-12 flex items-center justify-center bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] transition-colors disabled:opacity-50 shadow-sm shrink-0">
                  <FaPaperPlane className="h-5 w-5 ml-1" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="w-48 lg:w-64 mb-6 opacity-30">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" stroke="#00D26A" strokeWidth="10"/><path d="M30 50L45 65L70 35" stroke="#00D26A" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h2 className="text-xl lg:text-2xl font-light text-gray-600 mb-2">Digital Ad Bird Web</h2>
              <p className="text-sm text-gray-500 max-w-md">Select a contact from the sidebar to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
