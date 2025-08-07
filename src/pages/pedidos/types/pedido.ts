import { z } from 'zod';

export interface Cliente {
  id: number;
  documentId: string;
  nome: string;
  telefone: string;
  endereco: string;
  formaPagamentoPadrao: {
    id: number;
    nome: string;
  };
}

export interface FormaPagamento {
  id: number;
  documentId: string;
  nome: string;
  taxa: number;
}

export interface Pedido {
  id: number;
  documentId: string;
  situacao: 'NA_FILA' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE';
  cliente: Cliente;
  formaPagamento: FormaPagamento;
  endereco: string;
  dataDePreparo: string;
  dataHoraEntrega: string;
  valor: number;
  pago: 'SIM' | 'NAO' | 'METADE';
  quantidade: number;
  pedido: string;
  createdAt: string;
  updatedAt: string;
}

export const pedidoSchema = z.object({
  id: z.number().optional(),
  documentId: z.string().optional(),
  situacao: z.enum(['NA_FILA', 'EM_PREPARO', 'PRONTO', 'ENTREGUE']),
  cliente: z.number().min(1, 'Cliente é obrigatório'),
  formaPagamento: z.number().min(1, 'Forma de pagamento é obrigatória'),
  endereco: z
    .string()
    .min(1, 'Endereço é obrigatório')
    .max(144, 'Endereço deve ter no máximo 144 caracteres'),
  dataDePreparo: z.string().min(1, 'Data de preparo é obrigatória'),
  dataHoraEntrega: z.string().min(1, 'Data e hora da entrega são obrigatórias'),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  pago: z.enum(['SIM', 'NAO', 'METADE']),
  quantidade: z
    .number()
    .int()
    .min(0, 'Quantidade deve ser maior ou igual a zero'),
  pedido: z.string().min(1, 'Descrição do pedido é obrigatória'),
});

export const createPedidoSchema = pedidoSchema.omit({
  id: true,
  documentId: true,
});

export type CreatePedidoData = z.infer<typeof createPedidoSchema>;
export type PedidoFormData = z.infer<typeof pedidoSchema>;
