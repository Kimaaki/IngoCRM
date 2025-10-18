export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
      {/* Logo + Nome do CRM */}
      <h1 className="flex items-center text-lg font-semibold text-gray-800 gap-2">
        <img
          src="/favicon.ico"
          alt="ECentril Logo"
          className="h-6 w-6 rounded-sm"
        />
        ECentril Dashboard
      </h1>

      {/* Perfil Admin */}
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
