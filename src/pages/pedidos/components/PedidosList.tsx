import { useState } from 'react';
import type { Pedido } from '../types/pedido';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { Button } from '../../../components/ui/button';
import {
  MdChevronLeft,
  MdChevronRight,
  MdPayment,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';

interface PedidosListProps {
  pedidos: Pedido[];
  onEdit: (pedido: Pedido) => void;
  onDelete: (documentId: string) => void;
  onCreateNew: () => void;
  onMoveToNext: (pedido: Pedido) => void;
  onMoveToPrevious: (pedido: Pedido) => void;
  onMarkAsPaid: (pedido: Pedido) => void;
  onMarkAsPartiallyPaid: (pedido: Pedido) => void;
}

const statusConfig = {
  NA_FILA: {
    label: 'Na Fila',
    color: 'bg-yellow-500',
    bgColor: 'shadow-md shadow-yellow-50',
    borderColor: 'border-yellow-200',
  },
  EM_PREPARO: {
    label: 'Em Preparo',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  PRONTO: {
    label: 'Pronto',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  ENTREGUE: {
    label: 'Entregue',
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

const pagoConfig = {
  NAO: {
    label: 'Não Pago',
    color: 'text-red-600 bg-red-200  shadow-md shadow-red-400 rounded-full',
  },
  SIM: {
    label: 'Pago',
    color:
      'text-green-600 bg-green-100 shadow-md shadow-green-400 rounded-full',
  },
  METADE: {
    label: 'Parcial',
    color:
      'text-yellow-600 bg-yellow-100 shadow-md shadow-yellow-400 rounded-full',
  },
};

export default function PedidosList({
  pedidos,
  onEdit,
  onDelete,
  onCreateNew,
  onMoveToNext,
  onMoveToPrevious,
  onMarkAsPaid,
  onMarkAsPartiallyPaid,
}: PedidosListProps) {
  const [expandedPedidos, setExpandedPedidos] = useState<Set<number>>(
    new Set()
  );

  const toggleExpansion = (pedidoId: number) => {
    setExpandedPedidos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pedidoId)) {
        newSet.delete(pedidoId);
      } else {
        newSet.add(pedidoId);
      }
      return newSet;
    });
  };

  const isExpanded = (pedidoId: number) => expandedPedidos.has(pedidoId);

  const getPedidosByStatus = (status: keyof typeof statusConfig) => {
    return pedidos.filter(pedido => pedido.situacao === status);
  };

  const canMoveToPrevious = (pedido: Pedido) => {
    const statusOrder = ['NA_FILA', 'EM_PREPARO', 'PRONTO', 'ENTREGUE'];
    return statusOrder.indexOf(pedido.situacao) > 0;
  };

  const canMoveToNext = (pedido: Pedido) => {
    const statusOrder = ['NA_FILA', 'EM_PREPARO', 'PRONTO', 'ENTREGUE'];
    return statusOrder.indexOf(pedido.situacao) < statusOrder.length - 1;
  };

  const getNextPaymentStatus = (currentStatus: Pedido['pago']) => {
    const paymentOrder: Array<Pedido['pago']> = ['NAO', 'METADE', 'SIM'];
    const currentIndex = paymentOrder.indexOf(currentStatus);
    return currentIndex < paymentOrder.length - 1
      ? paymentOrder[currentIndex + 1]
      : null;
  };

  const getPaymentButtonText = (pedido: Pedido) => {
    const nextStatus = getNextPaymentStatus(pedido.pago);
    switch (nextStatus) {
      case 'METADE':
        return 'Parcial';
      case 'SIM':
        return 'Pago';
      default:
        return null;
    }
  };

  const handlePaymentClick = (pedido: Pedido) => {
    const nextStatus = getNextPaymentStatus(pedido.pago);
    switch (nextStatus) {
      case 'METADE':
        onMarkAsPartiallyPaid(pedido);
        break;
      case 'SIM':
        onMarkAsPaid(pedido);
        break;
    }
  };

  const handleDeleteClick = (pedido: Pedido) => {
    if (
      window.confirm(`Tem certeza que deseja excluir o pedido #${pedido.id}?`)
    ) {
      onDelete(pedido.documentId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Pedidos ({pedidos.length})
        </h2>
        <Button onClick={onCreateNew}>+ Novo Pedido</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const statusPedidos = getPedidosByStatus(
            status as keyof typeof statusConfig
          );

          return (
            <div key={status} className={`rounded-lg  shadow-md min-h-[500px]`}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                  <h3 className="font-semibold text-gray-800">
                    {config.label} ({statusPedidos.length})
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-3  overflow-y-auto">
                {statusPedidos.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">Nenhum pedido neste status</p>
                  </div>
                ) : (
                  statusPedidos.map(pedido => {
                    return (
                      <div
                        key={pedido.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => toggleExpansion(pedido.id)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${pagoConfig[pedido.pago].color}`}
                            >
                              {pagoConfig[pedido.pago].label}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600">
                              {isExpanded(pedido.id) ? (
                                <MdExpandLess size={20} />
                              ) : (
                                <MdExpandMore size={20} />
                              )}
                            </button>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Pedido do cliente {pedido.cliente?.nome}
                            </h4>
                          </div>

                          {pedido.dataHoraEntrega && (
                            <div className="mt-2 text-sm flex gap-2">
                              <h5 className="font-semibold text-gray-700 mb-2">
                                Data de Entrega:{' '}
                              </h5>
                              <p className="text-gray-900">
                                {formatDateTime(pedido.dataHoraEntrega)}
                              </p>
                            </div>
                          )}
                        </div>

                        {isExpanded(pedido.id) && (
                          <div className="px-4 pb-4">
                            <div className="border-t border-gray-200 pt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h5 className="font-semibold text-gray-700 mb-2">
                                    Cliente
                                  </h5>
                                  <p className="text-gray-900">
                                    {pedido.cliente?.nome}
                                  </p>
                                  <p className="text-gray-600">
                                    {pedido.cliente?.telefone}
                                  </p>
                                </div>

                                <div>
                                  <h5 className="font-semibold text-gray-700 mb-2">
                                    Forma de Pagamento
                                  </h5>
                                  <p className="text-gray-900">
                                    {pedido.formaPagamento.nome}
                                  </p>
                                </div>

                                <div>
                                  <h5 className="font-semibold text-gray-700 mb-2">
                                    Quantidade
                                  </h5>
                                  <p className="text-gray-900">
                                    {pedido.quantidade}
                                  </p>
                                </div>

                                <div>
                                  <h5 className="font-semibold text-gray-700 mb-2">
                                    Status
                                  </h5>
                                  <span
                                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig[pedido.situacao].color} text-white`}
                                  >
                                    {statusConfig[pedido.situacao].label}
                                  </span>
                                </div>

                                {pedido.dataDePreparo && (
                                  <div>
                                    <h5 className="font-semibold text-gray-700 mb-2">
                                      Data de Preparo
                                    </h5>
                                    <p className="text-gray-900">
                                      {formatDateTime(pedido.dataDePreparo)}
                                    </p>
                                  </div>
                                )}

                                <div className="mt-2 text-sm">
                                  <div className="md:col-span-2">
                                    <h5 className="font-semibold text-gray-700 mb-2">
                                      Valor
                                    </h5>
                                    <span className="text-gray-900">
                                      {formatCurrency(pedido.valor)}
                                    </span>
                                  </div>
                                </div>

                                <div className="md:col-span-2">
                                  <h5 className="font-semibold text-gray-700 mb-2">
                                    Endereço
                                  </h5>
                                  <p className="text-gray-900">
                                    {pedido.endereco}
                                  </p>
                                </div>

                                <div className="md:col-span-2">
                                  <h5 className="font-semibold text-gray-700 mb-2">
                                    Descrição do Pedido
                                  </h5>
                                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                                    {pedido.pedido}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="px-4 pb-4">
                          <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                            <div className="flex justify-between gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={e => {
                                  e.stopPropagation();
                                  onMoveToPrevious(pedido);
                                }}
                                disabled={!canMoveToPrevious(pedido)}
                                className="flex items-center gap-1 text-xs"
                              >
                                <MdChevronLeft size={16} />
                                Anterior
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={e => {
                                  e.stopPropagation();
                                  onMoveToNext(pedido);
                                }}
                                disabled={!canMoveToNext(pedido)}
                                className="flex items-center gap-1 text-xs"
                              >
                                Próximo
                                <MdChevronRight size={16} />
                              </Button>
                            </div>

                            {getPaymentButtonText(pedido) && (
                              <div className="flex justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handlePaymentClick(pedido);
                                  }}
                                  className="flex items-center gap-1 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                >
                                  <MdPayment size={16} />
                                  Marcar como {getPaymentButtonText(pedido)}
                                </Button>
                              </div>
                            )}

                            <div className="flex justify-between gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={e => {
                                  e.stopPropagation();
                                  onEdit(pedido);
                                }}
                                className="flex-1"
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDeleteClick(pedido);
                                }}
                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
