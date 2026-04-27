"use client";

import { useEffect, useState } from "react";
import { FaUsers, FaCommentAlt, FaBullhorn, FaChartLine } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/lib/api";

interface StatsData {
  totalContacts: number;
  totalMessages: number;
  totalCampaigns: number;
  messagesByDay: Array<{ _id: string; count: number }>;
  recentMessages: Array<any>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/stats")
      .then((res) => { setStats(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Contacts", value: stats?.totalContacts ?? 0, icon: FaUsers, color: "bg-blue-50 text-blue-600" },
    { label: "Total Messages", value: stats?.totalMessages ?? 0, icon: FaCommentAlt, color: "bg-green-50 text-green-600" },
    { label: "Campaigns", value: stats?.totalCampaigns ?? 0, icon: FaBullhorn, color: "bg-purple-50 text-purple-600" },
    { label: "Revenue", value: "₹0", icon: FaChartLine, color: "bg-orange-50 text-orange-600" },
  ];

  const chartData = stats?.messagesByDay?.map((d) => ({ date: d._id, messages: d.count })) ?? [];

  if (loading) return <div className="p-8 text-center text-muted">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted text-sm">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted">{card.label}</span>
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Messages Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="messages" stroke="#1FD669" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
        {stats?.recentMessages?.length ? (
          <div className="divide-y divide-gray-100">
            {stats.recentMessages.map((msg: any) => (
              <div key={msg._id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{msg.contactId?.name || msg.to}</div>
                  <div className="text-xs text-muted truncate max-w-md">{msg.content}</div>
                </div>
                <span className="text-xs text-muted">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No recent messages</p>
        )}
      </div>
    </div>
  );
}
