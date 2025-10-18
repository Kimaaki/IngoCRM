"use client";

import { Home, Users, ShoppingCart, Settings, Phone } from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { key: "leads", label: "Leads", icon: <Users className="h-4 w-4" /> },
    { key: "orders", label: "Orders", icon: <ShoppingCart className="h-4 w-4" /> },
    { key: "clients", label: "Clients", icon: <Phone className="h-4 w-4" /> },
    { key: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0b1623] text-white h-screen border-r border-gray-800">
      {/* Título do CRM */}
      <div className="flex items-center justify-center h-16 text-xl font-bold border-b border-gray-800">
        IngoCRM
      </div>

      {/* Menu lateral */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm transition ${
              activeTab === item.key
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
