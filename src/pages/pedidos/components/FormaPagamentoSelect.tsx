import { useState, useRef, useEffect } from 'react';
import type { FormaPagamento } from '../types/pedido';

interface FormaPagamentoSelectProps {
  formasPagamento: FormaPagamento[];
  value: number;
  onChange: (formaPagamentoId: number) => void;
  error?: string;
  required?: boolean;
}

export default function FormaPagamentoSelect({
  formasPagamento,
  value,
  onChange,
  error,
  required = false,
}: FormaPagamentoSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedFormaPagamento = formasPagamento.find(
    forma => forma.id === value
  );

  const filteredFormas = formasPagamento.filter(forma =>
    forma.nome.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSelect = (forma: FormaPagamento) => {
    onChange(forma.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Forma de Pagamento {required && '*'}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 text-left border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <span
            className={
              selectedFormaPagamento ? 'text-gray-900' : 'text-gray-500'
            }
          >
            {selectedFormaPagamento
              ? selectedFormaPagamento.nome
              : 'Selecione uma forma de pagamento'}
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
                placeholder="Buscar forma de pagamento..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filteredFormas.length > 0 ? (
                filteredFormas.map(forma => (
                  <button
                    key={forma.id}
                    type="button"
                    onClick={() => handleSelect(forma)}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {forma.nome}
                    </div>
                    <div className="text-xs text-gray-500">
                      Taxa: {forma.taxa}%
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nenhuma forma de pagamento encontrada
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
