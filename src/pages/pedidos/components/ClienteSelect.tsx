import { useState, useRef, useEffect } from 'react';
import type { Cliente } from '../types/pedido';
import { Button } from '../../../components/ui/button';

interface ClienteSelectProps {
  clientes: Cliente[];
  value: number;
  onChange: (clienteId: number, cliente?: Cliente) => void;
  error?: string;
  required?: boolean;
}

export default function ClienteSelect({
  clientes,
  value,
  onChange,
  error,
  required = false,
}: ClienteSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClienteModal, setShowClienteModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCliente = clientes.find(cliente => cliente.id === value);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (cliente: Cliente) => {
    onChange(cliente.id, cliente);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleNewCliente = () => {
    window.open('http://localhost:5174/clientes', '_blank');
    setShowClienteModal(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Cliente {required && '*'}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <span className={selectedCliente ? 'text-gray-900' : 'text-gray-500'}>
            {selectedCliente ? selectedCliente.nome : 'Selecione um cliente'}
          </span>
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filteredClientes.length > 0 ? (
                filteredClientes.map(cliente => (
                  <button
                    key={cliente.id}
                    type="button"
                    onClick={() => handleSelect(cliente)}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {cliente.nome}
                    </div>
                    <div className="text-xs text-gray-500">
                      {cliente.telefone}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nenhum cliente encontrado
                </div>
              )}
            </div>

            <div className="p-2 border-t bg-gray-50">
              <Button
                type="button"
                onClick={handleNewCliente}
                variant="outline"
                size="sm"
                className="w-full"
              >
                + Novo Cliente
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
