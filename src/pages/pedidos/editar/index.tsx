import { Suspense, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../shared/components/Layout';
import PedidoForm from '../components/PedidoForm';
import Breadcrumb from '../../shared/components/Breadcrumb';
import Loading from '../../shared/components/Loading';
import { usePedidos } from '../hooks/usePedidos';
import type { CreatePedidoData, Pedido } from '../types/pedido';
import {
  formatDateForInput,
  formatDateTimeForInput,
} from '../utils/formatters';

export default function PedidosEditarPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { pedidos, handleUpdatePedido, error, clearError } = usePedidos();
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Pedidos', href: '/pedidos/listar' },
    { label: 'Editar Pedido' },
  ];

  useEffect(() => {
    if (documentId && pedidos.length > 0) {
      const pedido = pedidos.find(p => p.documentId === documentId);
      if (pedido) {
        setEditingPedido(pedido);
      } else {
        navigate('/pedidos/listar');
      }
      setLoading(false);
    } else if (pedidos.length > 0) {
      setLoading(false);
    }
  }, [documentId, pedidos, navigate]);

  const handleFormSubmit = async (data: CreatePedidoData) => {
    if (!editingPedido || !documentId) {
      return;
    }

    const success = await handleUpdatePedido(documentId, data);
    if (success) {
      navigate('/pedidos/listar');
    }
  };

  const handleCancel = () => {
    clearError();
    navigate('/pedidos/listar');
  };

  const getInitialFormData = (): Partial<CreatePedidoData> | undefined => {
    if (!editingPedido) {
      return undefined;
    }

    return {
      situacao: editingPedido.situacao,
      cliente: editingPedido.cliente.id,
      formaPagamento: editingPedido.formaPagamento.id,
      endereco: editingPedido.endereco,
      dataDePreparo: editingPedido.dataDePreparo
        ? formatDateForInput(editingPedido.dataDePreparo)
        : '',
      dataHoraEntrega: editingPedido.dataHoraEntrega
        ? formatDateTimeForInput(editingPedido.dataHoraEntrega)
        : '',
      valor: editingPedido.valor,
      pago: editingPedido.pago,
      quantidade: editingPedido.quantidade,
      pedido: editingPedido.pedido,
    };
  };

  if (loading) {
    return (
      <Layout title="Editar Pedido" breadcrumbItems={breadcrumbItems}>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Editar Pedido" breadcrumbItems={breadcrumbItems}>
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

  if (!editingPedido) {
    return (
      <Layout title="Editar Pedido" breadcrumbItems={breadcrumbItems}>
        <div className="space-y-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Pedido não encontrado
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      O pedido que você está tentando editar não foi encontrado.
                    </p>
                    <button
                      onClick={() => navigate('/pedidos/listar')}
                      className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-600"
                    >
                      Voltar para lista de pedidos
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
    <Layout title="Editar Pedido" breadcrumbItems={breadcrumbItems}>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        <Suspense fallback={<Loading />}>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 space-y-6">
              <PedidoForm
                initialData={getInitialFormData()}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                isEditing={true}
              />
            </div>
          </div>
        </Suspense>
      </div>
    </Layout>
  );
}
