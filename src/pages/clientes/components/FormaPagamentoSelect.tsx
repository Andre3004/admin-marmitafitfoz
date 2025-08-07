import { useState } from 'react';
import type { FormaPagamento } from '../types/cliente';

interface FormaPagamentoSelectProps {
  formasPagamento: FormaPagamento[];
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function FormaPagamentoSelect({
  formasPagamento,
  value,
  onChange,
  error,
}: FormaPagamentoSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = formasPagamento.filter(forma =>
    forma.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = formasPagamento.find(forma => forma.id === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Forma de Pagamento Padrão *
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {selectedOption
            ? selectedOption.nome
            : 'Selecione uma forma de pagamento'}
          <span className="absolute right-2 top-2">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="p-2">
              <input
                type="text"
                placeholder="Buscar forma de pagamento..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-40 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-gray-500">
                  Nenhuma forma de pagamento encontrada
                </div>
              ) : (
                filteredOptions.map(forma => (
                  <button
                    key={forma.id}
                    type="button"
                    onClick={() => {
                      onChange(forma.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                      forma.id === value ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    {forma.nome}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
