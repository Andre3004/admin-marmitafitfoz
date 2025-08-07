import { useFieldArray } from 'react-hook-form';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { TipoCarboidrato, type MarmitaFormData } from '../types/calculadora';
import type { UseFormReturn } from 'react-hook-form';

interface CarboidratosSectionProps {
  form: UseFormReturn<MarmitaFormData>;
}

export const CarboidratosSection = ({ form }: CarboidratosSectionProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'carboidratos',
  });

  const carboidratoOptions = [
    { value: TipoCarboidrato.ARROZ, label: 'Arroz' },
    { value: TipoCarboidrato.FEIJAO, label: 'Feijão' },
    { value: TipoCarboidrato.BATATA_INGLESA, label: 'Batata Inglesa' },
    { value: TipoCarboidrato.BATATA_DOCE, label: 'Batata Doce' },
    { value: TipoCarboidrato.MACARRAO, label: 'Macarrão' },
  ];

  const addCarboidrato = (tipo: TipoCarboidrato) => {
    const exists = fields.some(field => field.tipo === tipo);
    if (!exists) {
      append({ tipo, quantidade: 100 });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Carboidratos</h3>

      <div className="space-y-3">
        <div>
          <Label>Selecionar Carboidratos</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {carboidratoOptions.map(option => {
              const isSelected = fields.some(
                field => field.tipo === option.value
              );
              return (
                <Button
                  key={option.value}
                  type="button"
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (isSelected) {
                      const index = fields.findIndex(
                        field => field.tipo === option.value
                      );
                      remove(index);
                    } else {
                      addCarboidrato(option.value);
                    }
                  }}
                  className="justify-start"
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>

        {fields.length > 0 && (
          <div className="space-y-3">
            <Label>Quantidades (gramas por porção)</Label>
            {fields.map((field, index) => {
              const option = carboidratoOptions.find(
                opt => opt.value === field.tipo
              );
              return (
                <div key={field.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {option?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        {...register(`carboidratos.${index}.quantidade`, {
                          valueAsNumber: true,
                        })}
                        className="mt-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remover
                      </Button>
                    </div>

                    {errors.carboidratos?.[index]?.quantidade && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.carboidratos[index]?.quantidade?.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {errors.carboidratos &&
          typeof errors.carboidratos.message === 'string' && (
            <p className="text-sm text-red-600">
              {errors.carboidratos.message}
            </p>
          )}
      </div>
    </div>
  );
};
