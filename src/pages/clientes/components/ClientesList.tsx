import { useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import type { Cliente } from '../types/cliente'
import { useClientes } from '../hooks/useClientes'
import { applyPhoneMask } from '../utils/phoneMask'
import { Button } from '../../../components/ui/button'

interface ClientesListProps {
  onEdit: (cliente: Cliente) => void
  onCreateNew: () => void
}

export default function ClientesList({ onEdit, onCreateNew }: ClientesListProps) {
  const { clientes, formasPagamento, deleteCliente, isLoading } = useClientes()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      setDeletingId(documentId)
      try {
        await deleteCliente(documentId)
      } catch (error) {
        console.error('Erro ao deletar cliente:', error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const getFormaPagamentoNome = (formaPagamentoId: number) => {
    const forma = formasPagamento.find(f => f.id === formaPagamentoId)
    return forma?.nome || 'N/A'
  }

  if (isLoading && clientes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">Carregando clientes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Clientes</h2>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <FiPlus size={16} />
          Novo Cliente
        </Button>
      </div>

      {clientes.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          Nenhum cliente cadastrado ainda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forma de Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cliente.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {applyPhoneMask(cliente.telefone)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {cliente.endereco}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getFormaPagamentoNome(cliente.formaPagamentoPadrao)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(cliente)}
                        title="Editar cliente"
                        className="h-8 w-8 text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                      >
                        <FiEdit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cliente.documentId && handleDelete(cliente.documentId)}
                        disabled={deletingId === cliente.documentId}
                        title="Deletar cliente"
                        className="h-8 w-8 text-red-600 hover:text-red-900 hover:bg-red-50"
                      >
                        <FiTrash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}