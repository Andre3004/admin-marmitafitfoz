import type {
  Cliente,
  CreateClienteData,
  FormaPagamento,
  APIResponse,
  ClienteAPIData,
} from '../pages/clientes/types/cliente';

const HOST = import.meta.env.VITE_API_HOST;

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth-token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const clientesUseCases = {
  async getClientes(): Promise<Cliente[]> {
    const response = await fetch(
      `${HOST}/api/clientes?populate=formaPagamentoPadrao`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar clientes');
    }

    const data: APIResponse<ClienteAPIData[]> = await response.json();

    return data.data.map(item => ({
      id: item.id,
      documentId: item.documentId,
      nome: item.nome,
      telefone: item.telefone,
      endereco: item.endereco,
      formaPagamentoPadrao: item.formaPagamentoPadrao?.id || 0,
    }));
  },

  async getCliente(documentId: string): Promise<Cliente> {
    const response = await fetch(
      `${HOST}/api/clientes/${documentId}?populate=formaPagamentoPadrao`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar cliente');
    }

    const data: APIResponse<ClienteAPIData> = await response.json();

    return {
      id: data.data.id,
      documentId: data.data.documentId,
      nome: data.data.nome,
      telefone: data.data.telefone,
      endereco: data.data.endereco,
      formaPagamentoPadrao: data.data.formaPagamentoPadrao?.id || 0,
    };
  },

  async createCliente(clienteData: CreateClienteData): Promise<Cliente> {
    const response = await fetch(`${HOST}/api/clientes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        data: {
          nome: clienteData.nome,
          telefone: clienteData.telefone,
          endereco: clienteData.endereco,
          formaPagamentoPadrao: clienteData.formaPagamentoPadrao,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar cliente');
    }

    const data: APIResponse<ClienteAPIData> = await response.json();

    return {
      id: data.data.id,
      documentId: data.data.documentId,
      nome: data.data.nome,
      telefone: data.data.telefone,
      endereco: data.data.endereco,
      formaPagamentoPadrao: clienteData.formaPagamentoPadrao,
    };
  },

  async updateCliente(
    documentId: string,
    clienteData: Partial<CreateClienteData>
  ): Promise<Cliente> {
    const response = await fetch(`${HOST}/api/clientes/${documentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        data: clienteData,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar cliente');
    }

    const data: APIResponse<ClienteAPIData> = await response.json();

    return {
      id: data.data.id,
      documentId: data.data.documentId,
      nome: data.data.nome,
      telefone: data.data.telefone,
      endereco: data.data.endereco,
      formaPagamentoPadrao: data.data.formaPagamentoPadrao?.id || 0,
    };
  },

  async deleteCliente(documentId: string): Promise<void> {
    const response = await fetch(`${HOST}/api/clientes/${documentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar cliente');
    }
  },

  async getFormasPagamento(): Promise<FormaPagamento[]> {
    const response = await fetch(`${HOST}/api/forma-pagamentos`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar formas de pagamento');
    }

    const data: APIResponse<FormaPagamento[]> = await response.json();
    return data.data;
  },
};
