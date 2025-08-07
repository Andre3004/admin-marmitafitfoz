import { create } from 'zustand';
import type {
  Pedido,
  CreatePedidoData,
  Cliente,
  FormaPagamento,
} from '../types/pedido';
import { pedidosUseCases } from '../../../use-cases/pedidos';

interface PedidosState {
  pedidos: Pedido[];
  clientes: Cliente[];
  formasPagamento: FormaPagamento[];
  isLoading: boolean;
  error: string | null;
  selectedPedido: Pedido | null;

  fetchPedidos: () => Promise<void>;
  fetchClientes: () => Promise<void>;
  fetchFormasPagamento: () => Promise<void>;
  createPedido: (data: CreatePedidoData) => Promise<void>;
  updatePedido: (
    documentId: string,
    data: Partial<CreatePedidoData>
  ) => Promise<void>;
  deletePedido: (documentId: string) => Promise<void>;
  moveToNextColumn: (pedido: Pedido) => Promise<void>;
  moveToPreviousColumn: (pedido: Pedido) => Promise<void>;
  markAsPaid: (pedido: Pedido) => Promise<void>;
  markAsPartiallyPaid: (pedido: Pedido) => Promise<void>;
  markAsUnpaid: (pedido: Pedido) => Promise<void>;
  setSelectedPedido: (pedido: Pedido | null) => void;
  clearError: () => void;
}

export const usePedidosStore = create<PedidosState>((set, get) => ({
  pedidos: [],
  clientes: [],
  formasPagamento: [],
  isLoading: false,
  error: null,
  selectedPedido: null,

  fetchPedidos: async () => {
    set({ isLoading: true, error: null });
    try {
      const pedidos = await pedidosUseCases.getPedidos();
      set({ pedidos, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao buscar pedidos',
        isLoading: false,
      });
    }
  },

  fetchClientes: async () => {
    try {
      const clientes = await pedidosUseCases.getClientes();
      set({ clientes });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao buscar clientes',
      });
    }
  },

  fetchFormasPagamento: async () => {
    try {
      const formasPagamento = await pedidosUseCases.getFormasPagamento();
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

  createPedido: async (data: CreatePedidoData) => {
    set({ isLoading: true, error: null });
    try {
      const newPedido = await pedidosUseCases.createPedido(data);
      set(state => ({
        pedidos: [...state.pedidos, newPedido],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao criar pedido',
        isLoading: false,
      });
      throw error;
    }
  },

  updatePedido: async (documentId: string, data: Partial<CreatePedidoData>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPedido = await pedidosUseCases.updatePedido(
        documentId,
        data
      );
      set(state => ({
        pedidos: state.pedidos.map(pedido =>
          pedido.documentId === documentId ? updatedPedido : pedido
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao atualizar pedido',
        isLoading: false,
      });
      throw error;
    }
  },

  deletePedido: async (documentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await pedidosUseCases.deletePedido(documentId);
      set(state => ({
        pedidos: state.pedidos.filter(
          pedido => pedido.documentId !== documentId
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao deletar pedido',
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedPedido: (pedido: Pedido | null) => {
    set({ selectedPedido: pedido });
  },

  moveToNextColumn: async (pedido: Pedido) => {
    const statusOrder: Array<Pedido['situacao']> = [
      'NA_FILA',
      'EM_PREPARO',
      'PRONTO',
      'ENTREGUE',
    ];
    const currentIndex = statusOrder.indexOf(pedido.situacao);

    if (currentIndex < statusOrder.length - 1) {
      const nextStatus = statusOrder[currentIndex + 1];
      await get().updatePedido(pedido.documentId, { situacao: nextStatus });
    }
  },

  moveToPreviousColumn: async (pedido: Pedido) => {
    const statusOrder: Array<Pedido['situacao']> = [
      'NA_FILA',
      'EM_PREPARO',
      'PRONTO',
      'ENTREGUE',
    ];
    const currentIndex = statusOrder.indexOf(pedido.situacao);

    if (currentIndex > 0) {
      const previousStatus = statusOrder[currentIndex - 1];
      await get().updatePedido(pedido.documentId, { situacao: previousStatus });
    }
  },

  markAsPaid: async (pedido: Pedido) => {
    await get().updatePedido(pedido.documentId, { pago: 'SIM' });
  },

  markAsPartiallyPaid: async (pedido: Pedido) => {
    await get().updatePedido(pedido.documentId, { pago: 'METADE' });
  },

  markAsUnpaid: async (pedido: Pedido) => {
    await get().updatePedido(pedido.documentId, { pago: 'NAO' });
  },

  clearError: () => {
    set({ error: null });
  },
}));
