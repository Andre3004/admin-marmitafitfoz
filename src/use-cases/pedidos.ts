import type {
  Pedido,
  CreatePedidoData,
  Cliente,
  FormaPagamento,
} from '../pages/pedidos/types/pedido';

const HOST = import.meta.env.VITE_API_HOST;

const getAuthHeader = () => {
  const token = localStorage.getItem('auth-token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const pedidosUseCases = {
  async getPedidos(): Promise<Pedido[]> {
    try {
      const response = await fetch(`${HOST}/api/pedidos?populate=*`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos');
      }

      const data = await response.json();
      return data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        situacao: item.situacao,
        cliente: {
          id: item.cliente.id,
          documentId: item.cliente.documentId,
          nome: item.cliente.nome,
          telefone: item.cliente.telefone,
          endereco: item.cliente.endereco,
          formaPagamentoPadrao: item.cliente.formaPagamentoPadrao,
        },
        formaPagamento: {
          id: item.formaPagamento.id,
          documentId: item.formaPagamento.documentId,
          nome: item.formaPagamento.nome,
          taxa: item.formaPagamento.taxa,
        },
        endereco: item.endereco,
        dataDePreparo: item.dataDePreparo,
        dataHoraEntrega: item.dataHoraEntrega,
        valor: item.valor,
        pago: item.pago,
        quantidade: item.quantidade,
        pedido: item.pedido,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  },

  async getClientes(): Promise<Cliente[]> {
    try {
      const response = await fetch(`${HOST}/api/clientes?populate=*`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
      }

      const data = await response.json();
      return data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        nome: item.nome,
        telefone: item.telefone,
        endereco: item.endereco,
        formaPagamentoPadrao: item.formaPagamentoPadrao || { id: 0, nome: '' },
      }));
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  },

  async getFormasPagamento(): Promise<FormaPagamento[]> {
    try {
      const response = await fetch(`${HOST}/api/forma-pagamentos`, {
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar formas de pagamento');
      }

      const data = await response.json();
      return data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        nome: item.nome,
        taxa: item.taxa,
      }));
    } catch (error) {
      console.error('Erro ao buscar formas de pagamento:', error);
      throw error;
    }
  },

  async createPedido(pedidoData: CreatePedidoData): Promise<Pedido> {
    try {
      const response = await fetch(`${HOST}/api/pedidos`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          data: {
            situacao: pedidoData.situacao,
            cliente: pedidoData.cliente,
            formaPagamento: pedidoData.formaPagamento,
            endereco: pedidoData.endereco,
            dataDePreparo: pedidoData.dataDePreparo,
            dataHoraEntrega: pedidoData.dataHoraEntrega,
            valor: pedidoData.valor,
            pago: pedidoData.pago,
            quantidade: pedidoData.quantidade,
            pedido: pedidoData.pedido,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao criar pedido');
      }

      const data = await response.json();
      const item = data.data;

      return {
        id: item.id,
        documentId: item.documentId,
        situacao: item.situacao,
        cliente: item.cliente,
        formaPagamento: item.formaPagamento,
        endereco: item.endereco,
        dataDePreparo: item.dataDePreparo,
        dataHoraEntrega: item.dataHoraEntrega,
        valor: item.valor,
        pago: item.pago,
        quantidade: item.quantidade,
        pedido: item.pedido,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  async updatePedido(
    documentId: string,
    pedidoData: Partial<CreatePedidoData>
  ): Promise<Pedido> {
    try {
      const response = await fetch(
        `${HOST}/api/pedidos/${documentId}?populate=*`,
        {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify({
            data: pedidoData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao atualizar pedido');
      }

      const data = await response.json();
      const item = data.data;

      return {
        id: item.id,
        documentId: item.documentId,
        situacao: item.situacao,
        cliente: item.cliente,
        formaPagamento: item.formaPagamento,
        endereco: item.endereco,
        dataDePreparo: item.dataDePreparo,
        dataHoraEntrega: item.dataHoraEntrega,
        valor: item.valor,
        pago: item.pago,
        quantidade: item.quantidade,
        pedido: item.pedido,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw error;
    }
  },

  async deletePedido(documentId: string): Promise<void> {
    try {
      const response = await fetch(`${HOST}/api/pedidos/${documentId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao deletar pedido');
      }
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      throw error;
    }
  },
};
