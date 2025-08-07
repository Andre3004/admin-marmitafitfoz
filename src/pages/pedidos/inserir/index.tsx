import { Suspense } from 'react';
import Layout from '../../shared/components/Layout';
import PedidoForm from '../components/PedidoForm';
import Breadcrumb from '../../shared/components/Breadcrumb';
import Loading from '../../shared/components/Loading';
import { usePedidos } from '../hooks/usePedidos';
import { useNavigate } from 'react-router-dom';
import type { CreatePedidoData } from '../types/pedido';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pedidos', href: '/pedidos/listar' },
  { label: 'Inserir Pedido' },
];

export default function PedidosInserirPage() {
  const navigate = useNavigate();
  const { handleCreatePedido, error, clearError } = usePedidos();

  const handleFormSubmit = async (data: CreatePedidoData) => {
    const success = await handleCreatePedido(data);
    if (success) {
      navigate('/pedidos/listar');
    }
  };

  const handleCancel = () => {
    clearError();
    navigate('/pedidos/listar');
  };

  if (error) {
    return (
      <Layout title="Inserir Pedido" breadcrumbItems={breadcrumbItems}>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Erro ao carregar dados
                    </h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                    <button
                      onClick={clearError}
                      className="mt-2 text-sm text-red-800 underline hover:text-red-600"
                    >
                      Tentar novamente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Inserir Pedido" breadcrumbItems={breadcrumbItems}>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        <Suspense fallback={<Loading />}>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 space-y-6">
              <PedidoForm
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                isEditing={false}
              />
            </div>
          </div>
        </Suspense>
      </div>
    </Layout>
  );
}
