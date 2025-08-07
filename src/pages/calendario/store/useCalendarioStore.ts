import { create } from 'zustand';
import type { CalendarDay, CalendarOrder } from '../types/calendario';
import { pedidosUseCases } from '../../../use-cases/pedidos';
import type { Pedido } from '../../pedidos/types/pedido';

interface CalendarioState {
  calendarData: CalendarDay[];
  isLoading: boolean;
  error: string | null;

  fetchCalendarData: () => Promise<void>;
  moveToNextStatus: (documentId: string) => Promise<void>;
  moveToPreviousStatus: (documentId: string) => Promise<void>;
  markAsPaid: (documentId: string) => Promise<void>;
  markAsPartiallyPaid: (documentId: string) => Promise<void>;
  clearError: () => void;
}

const convertPedidoToCalendarOrder = (pedido: Pedido): CalendarOrder => ({
  id: pedido.documentId,
  customer: pedido.cliente.nome,
  quantity: pedido.quantidade,
  value: pedido.valor,
  status: pedido.situacao,
  paymentMethod: pedido.formaPagamento.nome,
  paid: pedido.pago === 'SIM',
  paymentStatus: pedido.pago,
  pedido: pedido.pedido,
  address: pedido.endereco,
});

const groupPedidosByDate = (pedidos: Pedido[]): CalendarDay[] => {
  const groupedData = new Map<string, CalendarDay>();

  pedidos.forEach(pedido => {
    if (!pedido.dataHoraEntrega) {
      return;
    }

    const date = new Date(pedido.dataHoraEntrega);
    const dateKey = date.toDateString();

    if (!groupedData.has(dateKey)) {
      groupedData.set(dateKey, {
        date,
        totalOrders: 0,
        totalValue: 0,
        orders: [],
      });
    }

    const dayData = groupedData.get(dateKey)!;
    dayData.totalOrders += pedido.quantidade;
    dayData.totalValue += pedido.valor;
    dayData.orders.push(convertPedidoToCalendarOrder(pedido));
  });

  return Array.from(groupedData.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
};

export const useCalendarioStore = create<CalendarioState>((set, get) => ({
  calendarData: [],
  isLoading: false,
  error: null,

  fetchCalendarData: async () => {
    set({ isLoading: true, error: null });
    try {
      const pedidos = await pedidosUseCases.getPedidos();
      const calendarData = groupPedidosByDate(pedidos);
      set({ calendarData, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao buscar dados do calendário',
        isLoading: false,
      });
    }
  },

  moveToNextStatus: async (documentId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { calendarData, fetchCalendarData } = get();
      const order = calendarData
        .flatMap(day => day.orders)
        .find(order => order.id === documentId);

      if (!order) {
        set({ isLoading: false });
        return;
      }

      const statusOrder: Array<Pedido['situacao']> = [
        'NA_FILA',
        'EM_PREPARO',
        'PRONTO',
        'ENTREGUE',
      ];
      const currentIndex = statusOrder.indexOf(order.status);

      if (currentIndex < statusOrder.length - 1) {
        const nextStatus = statusOrder[currentIndex + 1];
        await pedidosUseCases.updatePedido(documentId, {
          situacao: nextStatus,
        });
        await fetchCalendarData();
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao atualizar status',
        isLoading: false,
      });
    }
  },

  moveToPreviousStatus: async (documentId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { calendarData, fetchCalendarData } = get();
      const order = calendarData
        .flatMap(day => day.orders)
        .find(order => order.id === documentId);

      if (!order) {
        set({ isLoading: false });
        return;
      }

      const statusOrder: Array<Pedido['situacao']> = [
        'NA_FILA',
        'EM_PREPARO',
        'PRONTO',
        'ENTREGUE',
      ];
      const currentIndex = statusOrder.indexOf(order.status);

      if (currentIndex > 0) {
        const previousStatus = statusOrder[currentIndex - 1];
        await pedidosUseCases.updatePedido(documentId, {
          situacao: previousStatus,
        });
        await fetchCalendarData();
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao atualizar status',
        isLoading: false,
      });
    }
  },

  markAsPaid: async (documentId: string) => {
    try {
      set({ isLoading: true, error: null });
      await pedidosUseCases.updatePedido(documentId, { pago: 'SIM' });
      await get().fetchCalendarData();
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao marcar como pago',
        isLoading: false,
      });
    }
  },

  markAsPartiallyPaid: async (documentId: string) => {
    try {
      set({ isLoading: true, error: null });
      await pedidosUseCases.updatePedido(documentId, { pago: 'METADE' });
      await get().fetchCalendarData();
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao marcar como parcialmente pago',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
