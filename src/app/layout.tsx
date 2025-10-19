// FILE: src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "ECentril CRM",
  description: "Dashboard de gestão de leads e pedidos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <body className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0f172a] text-white flex flex-col justify-between">
          <div>
            <div className="p-6 text-2xl font-bold border-b border-gray-700">
              <Link href="/">ECentril</Link>
            </div>

            <nav className="p-4 space-y-2">
              <Link
                href="/"
                className="block px-3 py-2 rounded hover:bg-gray-700 transition"
              >
                🏠 Dashboard
              </Link>

              <Link
                href="/leads"
                className="block px-3 py-2 rounded hover:bg-gray-700 transition"
              >
                👥 Leads
              </Link>

              <Link
                href="/orders"
                className="block px-3 py-2 rounded hover:bg-gray-700 transition"
              >
                🛒 Orders
              </Link>

              <Link
                href="/clients"
                className="block px-3 py-2 rounded hover:bg-gray-700 transition"
              >
                📞 Clients
              </Link>

              <Link
                href="/settings"
                className="block px-3 py-2 rounded hover:bg-gray-700 transition"
              >
                ⚙️ Settings
              </Link>
            </nav>
          </div>

          <footer className="p-4 border-t border-gray-700 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} ECentril Global CRM
          </footer>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
