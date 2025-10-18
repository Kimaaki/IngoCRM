export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-800">IngoCRM Dashboard</h1>
      <div className="flex items-center space-x-3">
        <span className="text-gray-600 text-sm">Admin</span>
        <img
          src="https://ui-avatars.com/api/?name=Admin"
          alt="avatar"
          className="h-8 w-8 rounded-full"
        />
      </div>
    </header>
  );
}
