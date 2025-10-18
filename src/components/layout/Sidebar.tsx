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

      {/* Navegação */}
      <nav className="flex-1 mt-4 space-y-2 px-4">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              activeTab === item.key
                ? "bg-gray-800 text-white font-medium"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Rodapé simples */}
      <div className="border-t border-gray-800 p-4 text-xs text-gray-500 text-center">
        © 2025 IngoCRM
      </div>
    </aside>
  );
}
