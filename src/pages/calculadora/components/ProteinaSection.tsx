import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { TipoProteina, type MarmitaFormData } from '../types/calculadora';
import type { UseFormReturn } from 'react-hook-form';

interface ProteinaSectionProps {
  form: UseFormReturn<MarmitaFormData>;
}

export const ProteinaSection = ({ form }: ProteinaSectionProps) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const proteinaTipo = watch('proteina.tipo');

  const proteinaOptions = [
    { value: TipoProteina.FRANGO, label: 'Frango' },
    { value: TipoProteina.CARNE, label: 'Carne' },
    { value: TipoProteina.PEIXE, label: 'Peixe' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Proteína</h3>

      <div className="space-y-3">
        <div>
          <Label htmlFor="proteina-tipo">Tipo de Proteína</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {proteinaOptions.map(option => (
              <label
                key={option.value}
                className={`
                  flex items-center justify-center p-3 border rounded-md cursor-pointer transition-colors
                  ${
                    proteinaTipo === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('proteina.tipo')}
                  className="sr-only"
                  onChange={e =>
                    setValue('proteina.tipo', e.target.value as TipoProteina)
                  }
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.proteina?.tipo && (
            <p className="text-sm text-red-600 mt-1">
              {errors.proteina.tipo.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="proteina-quantidade">Quantidade (gramas)</Label>
          <Input
            id="proteina-quantidade"
            type="number"
            min="1"
            {...register('proteina.quantidade', { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.proteina?.quantidade && (
            <p className="text-sm text-red-600 mt-1">
              {errors.proteina.quantidade.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
