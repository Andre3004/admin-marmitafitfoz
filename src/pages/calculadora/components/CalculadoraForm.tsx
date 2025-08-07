import type { UseFormReturn } from 'react-hook-form';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { ProteinaSection } from './ProteinaSection';
import { CarboidratosSection } from './CarboidratosSection';
import { LegumesSection } from './LegumesSection';
import { type MarmitaFormData } from '../types/calculadora';

interface CalculadoraFormProps {
  form: UseFormReturn<MarmitaFormData>;
  onSubmit: (data: MarmitaFormData) => void;
  onReset: () => void;
  isLoading: boolean;
}

export const CalculadoraForm = ({
  form,
  onSubmit,
  onReset,
  isLoading,
}: CalculadoraFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <ProteinaSection form={form} />

          <div className="border-t pt-6">
            <CarboidratosSection form={form} />
          </div>

          <div className="border-t pt-6">
            <LegumesSection form={form} />
          </div>

          <div className="border-t pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quantidade de Marmitas</h3>
              <div>
                <Label htmlFor="quantidade">Número de Marmitas</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  {...register('quantidade', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.quantidade && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.quantidade.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Calculando...' : 'Calcular Preço'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isLoading}
          >
            Limpar
          </Button>
        </div>
      </form>
    </Card>
  );
};
