import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import type { CreatePedidoData, Cliente } from '../types/pedido';
import { createPedidoSchema } from '../types/pedido';
import { Button } from '../../../components/ui/button';
import ClienteSelect from './ClienteSelect';
import FormaPagamentoSelect from './FormaPagamentoSelect';
import { usePedidos } from '../hooks/usePedidos';
import {
  formatCurrencyInput,
  parseCurrencyInput,
  formatApiCurrency,
} from '../utils/formatters';

interface PedidoFormProps {
  initialData?: Partial<CreatePedidoData>;
  onSubmit: (data: CreatePedidoData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

export default function PedidoForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: PedidoFormProps) {
  const { clientes, formasPagamento, isLoading, refreshData } = usePedidos();
  const [, setSelectedCliente] = useState<Cliente | null>(null);
  const [valorFormatted, setValorFormatted] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePedidoData>({
    resolver: zodResolver(createPedidoSchema),
    defaultValues: {
      situacao: 'NA_FILA' as const,
      cliente: initialData?.cliente || 0,
      formaPagamento: initialData?.formaPagamento || 0,
      endereco: initialData?.endereco || '',
      dataDePreparo: initialData?.dataDePreparo || '',
      dataHoraEntrega: initialData?.dataHoraEntrega || '',
      valor: initialData?.valor || 0,
      pago: 'NAO' as const,
      quantidade: initialData?.quantidade || 0,
      pedido: initialData?.pedido || '',
      ...initialData,
    },
  });

  const clienteValue = watch('cliente');
  const formaPagamentoValue = watch('formaPagamento');
  const enderecoValue = watch('endereco');

  useEffect(() => {
    if (initialData?.valor) {
      setValorFormatted(
        formatCurrencyInput((initialData.valor * 100).toString())
      );
    }
  }, [initialData]);

  useEffect(() => {
    if (clienteValue && clientes.length > 0) {
      const cliente = clientes.find(c => c.id === clienteValue);
      if (cliente) {
        setSelectedCliente(cliente);
        if (!enderecoValue && cliente.endereco) {
          setValue('endereco', cliente.endereco);
        }
        if (!formaPagamentoValue && cliente.formaPagamentoPadrao?.id) {
          setValue('formaPagamento', cliente.formaPagamentoPadrao.id);
        }
      }
    }
  }, [clienteValue, clientes, setValue, enderecoValue, formaPagamentoValue]);

  const handleClienteChange = (clienteId: number, cliente?: Cliente) => {
    setValue('cliente', clienteId);
    if (cliente) {
      setSelectedCliente(cliente);
      if (cliente.endereco) {
        setValue('endereco', cliente.endereco);
      }
      if (cliente.formaPagamentoPadrao?.id) {
        setValue('formaPagamento', cliente.formaPagamentoPadrao.id);
      }
    }
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setValorFormatted(formatted);
    const numericValue = parseCurrencyInput(formatted);
    setValue('valor', numericValue);
  };

  const onFormSubmit = async (data: CreatePedidoData) => {
    try {
      const formattedData = {
        ...data,
        valor: formatApiCurrency(data.valor),
      };
      await onSubmit(formattedData);

      if (!isEditing) {
        reset();
        setValorFormatted('');
        setSelectedCliente(null);
        refreshData();
      }
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar Pedido' : 'Novo Pedido'}
      </h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Situação *
            </label>
            <select
              {...register('situacao')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.situacao ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="NA_FILA">Na Fila</option>
              <option value="EM_PREPARO">Em Preparo</option>
              <option value="PRONTO">Pronto</option>
              <option value="ENTREGUE">Entregue</option>
            </select>
            {errors.situacao && (
              <p className="mt-1 text-sm text-red-600">
                {errors.situacao.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pago *
            </label>
            <select
              {...register('pago')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.pago ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="NAO">Não</option>
              <option value="SIM">Sim</option>
              <option value="METADE">Metade</option>
            </select>
            {errors.pago && (
              <p className="mt-1 text-sm text-red-600">{errors.pago.message}</p>
            )}
          </div>
        </div>

        <ClienteSelect
          clientes={clientes}
          value={clienteValue}
          onChange={handleClienteChange}
          error={errors.cliente?.message}
          required
        />

        <FormaPagamentoSelect
          formasPagamento={formasPagamento}
          value={formaPagamentoValue}
          onChange={id => setValue('formaPagamento', id)}
          error={errors.formaPagamento?.message}
          required
        />

        <div>
          <label
            htmlFor="endereco"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Endereço *
          </label>
          <input
            id="endereco"
            type="text"
            {...register('endereco')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.endereco ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite o endereço de entrega"
            maxLength={144}
          />
          {errors.endereco && (
            <p className="mt-1 text-sm text-red-600">
              {errors.endereco.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dataDePreparo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data de Preparo
            </label>
            <input
              id="dataDePreparo"
              type="date"
              {...register('dataDePreparo')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dataDePreparo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dataDePreparo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.dataDePreparo.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="dataHoraEntrega"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data e Hora da Entrega
            </label>
            <input
              id="dataHoraEntrega"
              type="datetime-local"
              {...register('dataHoraEntrega')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dataHoraEntrega ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dataHoraEntrega && (
              <p className="mt-1 text-sm text-red-600">
                {errors.dataHoraEntrega.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="valor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Valor *
            </label>
            <input
              id="valor"
              type="text"
              value={valorFormatted}
              onChange={handleValorChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.valor ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0,00"
            />
            {errors.valor && (
              <p className="mt-1 text-sm text-red-600">
                {errors.valor.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="quantidade"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantidade
            </label>
            <input
              id="quantidade"
              type="number"
              {...register('quantidade', { valueAsNumber: true })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.quantidade ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
              min="0"
              step="1"
            />
            {errors.quantidade && (
              <p className="mt-1 text-sm text-red-600">
                {errors.quantidade.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="pedido"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descrição do Pedido *
          </label>
          <textarea
            id="pedido"
            {...register('pedido')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.pedido ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite a descrição do pedido"
            rows={4}
          />
          {errors.pedido && (
            <p className="mt-1 text-sm text-red-600">{errors.pedido.message}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            {isSubmitting
              ? 'Salvando...'
              : isEditing
                ? 'Atualizar'
                : 'Criar Pedido'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
