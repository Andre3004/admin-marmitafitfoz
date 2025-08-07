import type { UseFormReturn } from 'react-hook-form';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { type MarmitaFormData } from '../types/calculadora';

interface LegumesSectionProps {
  form: UseFormReturn<MarmitaFormData>;
}

export const LegumesSection = ({ form }: LegumesSectionProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Mix de Legumes</h3>

      <div>
        <Label htmlFor="mix-legumes-quantidade">
          Quantidade (gramas por porção)
        </Label>
        <Input
          id="mix-legumes-quantidade"
          type="number"
          min="1"
          {...register('mixLegumesQuantidade', { valueAsNumber: true })}
          className="mt-1"
        />
        {errors.mixLegumesQuantidade && (
          <p className="text-sm text-red-600 mt-1">
            {errors.mixLegumesQuantidade.message}
          </p>
        )}
      </div>
    </div>
  );
};
