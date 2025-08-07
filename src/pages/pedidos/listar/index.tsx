import { Suspense } from 'react';
import Layout from '../../shared/components/Layout';
import PedidosList from '../components/PedidosList';
import Breadcrumb from '../../shared/components/Breadcrumb';
import Loading from '../../shared/components/Loading';
import { usePedidos } from '../hooks/usePedidos';
import { useNavigate } from 'react-router-dom';
import type { Pedido } from '../types/pedido';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pedidos', href: '/pedidos/listar' },
];

export default function PedidosListarPage() {
  const navigate = useNavigate();
  const {
    pedidos,
    handleDeletePedido,
    handleMoveToNext,
    handleMoveToPrevious,
    handleMarkAsPaid,
    handleMarkAsPartiallyPaid,
    handleMarkAsUnpaid,
  } = usePedidos();

  const handleEdit = (pedido: Pedido) => {
    navigate(`/pedidos/editar/${pedido.documentId}`);
  };

  const handleCreateNew = () => {
    navigate('/pedidos/inserir');
  };

  const handleDelete = async (documentId: string) => {
    await handleDeletePedido(documentId);
  };

  return (
    <Layout title="Listar Pedidos" breadcrumbItems={breadcrumbItems}>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        <Suspense fallback={<Loading />}>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 space-y-6">
              <PedidosList
                pedidos={pedidos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreateNew={handleCreateNew}
                onMoveToNext={handleMoveToNext}
                onMoveToPrevious={handleMoveToPrevious}
                onMarkAsPaid={handleMarkAsPaid}
                onMarkAsPartiallyPaid={handleMarkAsPartiallyPaid}
                onMarkAsUnpaid={handleMarkAsUnpaid}
              />
            </div>
          </div>
        </Suspense>
      </div>
    </Layout>
  );
}
