import { useState } from 'react'
import type { Cliente, CreateClienteData } from '../types/cliente'
import { useClientes } from '../hooks/useClientes'
import Layout from '../../shared/components/Layout'
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert'
import { Button } from '../../../components/ui/button'
import ClientesList from './ClientesList'
import ClienteForm from './ClienteForm'

export default function ClientesContent() {
  const { createCliente, updateCliente, error, clearError } = useClientes()
  const [showForm, setShowForm] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Clientes' }
  ]

  const handleCreateNew = () => {
    setEditingCliente(null)
    setShowForm(true)
    clearError()
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setShowForm(true)
    clearError()
  }

  const handleFormSubmit = async (data: CreateClienteData) => {
    if (editingCliente?.documentId) {
      await updateCliente(editingCliente.documentId, data)
    } else {
      await createCliente(data)
    }
    handleFormCancel()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingCliente(null)
    clearError()
  }

  return (
    <Layout 
      title="Gestão de Clientes" 
      breadcrumbItems={breadcrumbItems}
    >
      <div className="space-y-6">
        <p className="text-gray-600">Gerencie os clientes da sua empresa</p>

        {error && (
          <Alert variant="destructive">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="mt-2 h-auto p-0 text-red-600 hover:text-red-800"
              >
                Fechar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {showForm ? (
          <ClienteForm
            initialData={editingCliente || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isEditing={!!editingCliente}
          />
        ) : (
          <ClientesList
            onEdit={handleEdit}
            onCreateNew={handleCreateNew}
          />
        )}
      </div>
    </Layout>
  )
}