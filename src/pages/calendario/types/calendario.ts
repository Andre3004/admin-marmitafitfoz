export interface CalendarDay {
  date: Date;
  totalOrders: number;
  totalValue: number;
  orders: CalendarOrder[];
}

export interface CalendarOrder {
  id: string;
  customer: string;
  quantity: number;
  value: number;
  status: 'NA_FILA' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE';
  paymentMethod: string;
  paid: boolean;
  paymentStatus: 'SIM' | 'NAO' | 'METADE';
  pedido: string;
  address: string;
}
