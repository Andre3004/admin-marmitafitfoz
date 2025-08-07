import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateClienteData } from '../types/cliente';
import { createClienteSchema } from '../types/cliente';
import { applyPhoneMask, removePhoneMask } from '../utils/phoneMask';
import FormaPagamentoSelect from './FormaPagamentoSelect';
import { useClientes } from '../hooks/useClientes';
import { Button } from '../../../components/ui/button';

interface ClienteFormProps {
  initialData?: Partial<CreateClienteData>;
  onSubmit: (data: CreateClienteData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function ClienteForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: ClienteFormProps) {
  const { formasPagamento, isLoading } = useClientes();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateClienteData>({
    resolver: zodResolver(createClienteSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      telefone: initialData?.telefone || '',
      endereco: initialData?.endereco || '',
      formaPagamentoPadrao: initialData?.formaPagamentoPadrao || 0,
    },
  });

  const telefoneValue = watch('telefone');
  const formaPagamentoPadraoValue = watch('formaPagamentoPadrao');

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyPhoneMask(e.target.value);
    setValue('telefone', maskedValue);
  };

  const onFormSubmit = async (data: CreateClienteData) => {
    const formattedData = {
      ...data,
      telefone: removePhoneMask(data.telefone),
    };
    await onSubmit(formattedData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
      </h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome *
          </label>
          <input
            id="nome"
            type="text"
            {...register('nome')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nome ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite o nome do cliente"
            maxLength={144}
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="telefone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Telefone *
          </label>
          <input
            id="telefone"
            type="text"
            value={telefoneValue}
            onChange={handleTelefoneChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.telefone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="(45) 9 9999-9999"
            maxLength={16}
          />
          {errors.telefone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.telefone.message}
            </p>
          )}
        </div>

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
            placeholder="Digite o endereço do cliente"
            maxLength={144}
          />
          {errors.endereco && (
            <p className="mt-1 text-sm text-red-600">
              {errors.endereco.message}
            </p>
          )}
        </div>

        <FormaPagamentoSelect
          formasPagamento={formasPagamento}
          value={formaPagamentoPadraoValue}
          onChange={value => setValue('formaPagamentoPadrao', value)}
          error={errors.formaPagamentoPadrao?.message}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
