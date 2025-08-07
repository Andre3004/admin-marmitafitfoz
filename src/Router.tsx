import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './pages/shared/store/useAuthStore';
import Layout from './pages/shared/components/Layout';
import LoginPage from './pages/login';
import ClientesPage from './pages/clientes';
import PedidosListarPage from './pages/pedidos/listar';
import PedidosInserirPage from './pages/pedidos/inserir';
import PedidosEditarPage from './pages/pedidos/editar';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function Dashboard() {
  const breadcrumbItems = [{ label: 'Dashboard' }];

  return (
    <Layout title="Dashboard" breadcrumbItems={breadcrumbItems}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/clientes"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gestão de Clientes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Gerenciar clientes
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/pedidos/listar"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gestão de Pedidos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Gerenciar pedidos
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-white overflow-hidden shadow rounded-lg opacity-50">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-400 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Marmitas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Em breve...
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <ClientesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos/listar"
          element={
            <ProtectedRoute>
              <PedidosListarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos/inserir"
          element={
            <ProtectedRoute>
              <PedidosInserirPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos/editar/:documentId"
          element={
            <ProtectedRoute>
              <PedidosEditarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={<Navigate to="/pedidos/listar" replace />}
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
