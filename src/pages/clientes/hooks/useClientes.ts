import { useEffect } from 'react';
import { useClientesStore } from '../store/useClientesStore';

export const useClientes = () => {
  const store = useClientesStore();

  useEffect(() => {
    store.fetchClientes();
    store.fetchFormasPagamento();
  }, []);

  return {
    clientes: store.clientes,
    formasPagamento: store.formasPagamento,
    isLoading: store.isLoading,
    error: store.error,
    selectedCliente: store.selectedCliente,
    createCliente: store.createCliente,
    updateCliente: store.updateCliente,
    deleteCliente: store.deleteCliente,
    setSelectedCliente: store.setSelectedCliente,
    clearError: store.clearError,
  };
};
