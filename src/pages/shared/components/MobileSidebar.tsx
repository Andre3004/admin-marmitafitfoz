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
    href: '/pedidos',
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
    disabled: true,
  },
];

export default function MobileSidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const { isOpen, toggle } = useSidebarStore();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {menuItems
            .filter(item => !item.disabled)
            .map(item => {
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="flex flex-col items-center gap-1 px-3 py-2 h-auto text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="text-xs font-medium">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={toggle}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 transform transition-transform duration-300 ease-out"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
                  <span className="text-sm font-bold text-white">M</span>
                </div>
                <span className="text-lg font-semibold">Marmita Fit</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggle}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            <nav className="space-y-2 mb-6">
              {menuItems.map(item => {
                const isActive = location.pathname === item.href;
                const isDisabled = item.disabled;

                if (isDisabled) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-auto text-xs">(Em breve)</span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={toggle}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
