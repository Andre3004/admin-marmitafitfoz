import { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import BreadcrumbComponent from './Breadcrumb.tsx';
import { useSidebarStore } from '../store/useSidebarStore';
import { Button } from '../../../components/ui/button';
import { useMediaQuery } from '../hooks/useMediaQuery.ts';

interface LayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbItems: Array<{ label: string; href?: string }>;
}

export default function Layout({
  children,
  title,
  breadcrumbItems,
}: LayoutProps) {
  const { isOpen, toggle } = useSidebarStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 pb-20 md:pb-6">
            <div className="flex items-center gap-4 mb-6">
              {!isOpen && !isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggle}
                  className="hidden md:flex size-12 p-0 hover:bg-gray-100"
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              )}
              <BreadcrumbComponent items={breadcrumbItems} />
            </div>

            <div className="mt-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {title}
                </h1>
              </div>

              {children}
            </div>
          </div>
        </main>
      </div>

      <MobileSidebar />
    </div>
  );
}
