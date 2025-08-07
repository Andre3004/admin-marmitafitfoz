import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useSidebarStore } from '../store/useSidebarStore';
import { Button } from '../../../components/ui/button';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z"
        />
      </svg>
    ),
  },
  {
    name: 'Clientes',
    href: '/clientes',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
  },
  {
    name: 'Pedidos',
    href: '/pedidos/listar',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const { isOpen, toggle } = useSidebarStore();

  return (
    <div
      className={`hidden md:flex h-screen flex-col border-r border-gray-100 bg-white transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          {isOpen && (
            <span className="text-lg font-semibold transition-opacity duration-300">
              Marmita Fit
            </span>
          )}
        </div>
        {isOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="size-10 p-0 hover:bg-gray-100"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map(item => {
          const isActive =
            location.pathname === item.href ||
            (item.href === '/pedidos/listar' &&
              location.pathname.startsWith('/pedidos'));

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center rounded-lg text-sm font-medium transition-all hover:bg-gray-100 ${
                isOpen ? 'gap-3 px-3 py-2' : 'justify-center px-2 py-3'
              } ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              title={!isOpen ? item.name : undefined}
            >
              {item.icon}
              {isOpen && (
                <span className="transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className={`text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-all ${
            isOpen ? 'w-full justify-start' : 'w-12 h-12 p-0 justify-center'
          }`}
          title={!isOpen ? 'Sair' : undefined}
        >
          <svg
            className={`w-4 h-4 ${isOpen ? 'mr-2' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {isOpen && (
            <span className="transition-opacity duration-300">Sair</span>
          )}
        </Button>
      </div>
    </div>
  );
}
