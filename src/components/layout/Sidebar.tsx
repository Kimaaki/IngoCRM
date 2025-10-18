export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 hidden lg:block">
      <h2 className="text-xl font-bold mb-6">IngoCRM</h2>
      <nav className="space-y-2">
        <a href="#" className="block p-2 hover:bg-gray-800 rounded">Dashboard</a>
        <a href="#" className="block p-2 hover:bg-gray-800 rounded">Leads</a>
        <a href="#" className="block p-2 hover:bg-gray-800 rounded">Orders</a>
        <a href="#" className="block p-2 hover:bg-gray-800 rounded">Clients</a>
        <a href="#" className="block p-2 hover:bg-gray-800 rounded">Settings</a>
      </nav>
    </aside>
  );
}
