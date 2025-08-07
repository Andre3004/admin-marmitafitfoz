import { create } from 'zustand';
import type {
  Cliente,
  CreateClienteData,
  FormaPagamento,
} from '../types/cliente';
import { clientesUseCases } from '../../../use-cases/clientes';

interface ClientesState {
  clientes: Cliente[];
  formasPagamento: FormaPagamento[];
  isLoading: boolean;
  error: string | null;
  selectedCliente: Cliente | null;

  fetchClientes: () => Promise<void>;
  fetchFormasPagamento: () => Promise<void>;
  createCliente: (data: CreateClienteData) => Promise<void>;
  updateCliente: (
    documentId: string,
    data: Partial<CreateClienteData>
  ) => Promise<void>;
  deleteCliente: (documentId: string) => Promise<void>;
  setSelectedCliente: (cliente: Cliente | null) => void;
  clearError: () => void;
}

export const useClientesStore = create<ClientesState>(set => ({
  clientes: [],
  formasPagamento: [],
  isLoading: false,
  error: null,
  selectedCliente: null,

  fetchClientes: async () => {
    set({ isLoading: true, error: null });
    try {
      const clientes = await clientesUseCases.getClientes();
      set({ clientes, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao buscar clientes',
        isLoading: false,
      });
    }
  },

  fetchFormasPagamento: async () => {
    try {
      const formasPagamento = await clientesUseCases.getFormasPagamento();
      set({ formasPagamento });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao buscar formas de pagamento',
      });
    }
  },

  createCliente: async (data: CreateClienteData) => {
    set({ isLoading: true, error: null });
    try {
      const newCliente = await clientesUseCases.createCliente(data);
      set(state => ({
        clientes: [...state.clientes, newCliente],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao criar cliente',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCliente: async (
    documentId: string,
    data: Partial<CreateClienteData>
  ) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCliente = await clientesUseCases.updateCliente(
        documentId,
        data
      );
      set(state => ({
        clientes: state.clientes.map(cliente =>
          cliente.documentId === documentId ? updatedCliente : cliente
        ),
        selectedCliente:
          state.selectedCliente?.documentId === documentId
            ? updatedCliente
            : state.selectedCliente,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao atualizar cliente',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCliente: async (documentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await clientesUseCases.deleteCliente(documentId);
      set(state => ({
        clientes: state.clientes.filter(
          cliente => cliente.documentId !== documentId
        ),
        selectedCliente:
          state.selectedCliente?.documentId === documentId
            ? null
            : state.selectedCliente,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao deletar cliente',
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedCliente: (cliente: Cliente | null) => {
    set({ selectedCliente: cliente });
  },

  clearError: () => {
    set({ error: null });
  },
}));
