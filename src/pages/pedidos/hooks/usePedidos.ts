import { useEffect } from 'react';
import { usePedidosStore } from '../store/usePedidosStore';
import type { Pedido, CreatePedidoData } from '../types/pedido';

export const usePedidos = () => {
  const {
    pedidos,
    clientes,
    formasPagamento,
    isLoading,
    error,
    selectedPedido,
    fetchPedidos,
    fetchClientes,
    fetchFormasPagamento,
    createPedido,
    updatePedido,
    deletePedido,
    moveToNextColumn,
    moveToPreviousColumn,
    markAsPaid,
    markAsPartiallyPaid,
    markAsUnpaid,
    setSelectedPedido,
    clearError,
  } = usePedidosStore();

  useEffect(() => {
    fetchPedidos();
    fetchClientes();
    fetchFormasPagamento();
  }, [fetchPedidos, fetchClientes, fetchFormasPagamento]);

  const handleCreatePedido = async (data: CreatePedidoData) => {
    try {
      await createPedido(data);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleUpdatePedido = async (
    documentId: string,
    data: Partial<CreatePedidoData>
  ) => {
    try {
      await updatePedido(documentId, data);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleDeletePedido = async (documentId: string) => {
    try {
      await deletePedido(documentId);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleMoveToNext = async (pedido: Pedido) => {
    try {
      await moveToNextColumn(pedido);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleMoveToPrevious = async (pedido: Pedido) => {
    try {
      await moveToPreviousColumn(pedido);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleMarkAsPaid = async (pedido: Pedido) => {
    try {
      await markAsPaid(pedido);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleMarkAsPartiallyPaid = async (pedido: Pedido) => {
    try {
      await markAsPartiallyPaid(pedido);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleMarkAsUnpaid = async (pedido: Pedido) => {
    try {
      await markAsUnpaid(pedido);
      return true;
    } catch (error) {
      return false;
    }
  };

  const getPedidosByStatus = (status: string) => {
    return pedidos.filter(pedido => pedido.situacao === status);
  };

  const getClienteById = (id: number) => {
    return clientes.find(cliente => cliente.id === id);
  };

  const getFormaPagamentoById = (id: number) => {
    return formasPagamento.find(forma => forma.id === id);
  };

  const refreshData = () => {
    fetchPedidos();
    fetchClientes();
  };

  return {
    pedidos,
    clientes,
    formasPagamento,
    isLoading,
    error,
    selectedPedido,
    handleCreatePedido,
    handleUpdatePedido,
    handleDeletePedido,
    handleMoveToNext,
    handleMoveToPrevious,
    handleMarkAsPaid,
    handleMarkAsPartiallyPaid,
    handleMarkAsUnpaid,
    getPedidosByStatus,
    getClienteById,
    getFormaPagamentoById,
    setSelectedPedido,
    clearError,
    refreshData,
  };
};
