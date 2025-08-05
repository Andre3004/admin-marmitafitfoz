import { z } from 'zod'

export const clienteSchema = z.object({
    id: z.number().optional(),
    documentId: z.string().optional(),
    nome: z.string().min(1, 'Nome é obrigatório').max(144, 'Nome deve ter no máximo 144 caracteres'),
    telefone: z.string().min(1, 'Telefone é obrigatório').max(144, 'Telefone deve ter no máximo 144 caracteres'),
    endereco: z.string().min(1, 'Endereço é obrigatório').max(144, 'Endereço deve ter no máximo 144 caracteres'),
    formaPagamentoPadrao: z.number().min(1, 'Forma de pagamento é obrigatória'),
})

export const createClienteSchema = clienteSchema.omit({ id: true, documentId: true })

export type Cliente = z.infer<typeof clienteSchema>
export type CreateClienteData = z.infer<typeof createClienteSchema>

export interface FormaPagamento
{
    id: number
    documentId: string
    nome: string
    taxa: number
    createdAt: string
    updatedAt: string
    publishedAt: string
    locale: string
}

export interface APIResponse<T>
{
    data: T
    meta?: {
        pagination?: {
            page: number
            pageSize: number
            pageCount: number
            total: number
        }
    }
}

export interface ClienteAPIData
{
    id: number
    documentId: string
    nome: string
    telefone: string
    endereco: string
    formaPagamentoPadrao?: {
        id: number
        documentId: string
        nome: string
        taxa: number
    }
    createdAt: string
    updatedAt: string
    publishedAt: string
    locale: string
}