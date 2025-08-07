import { Card } from '../../../components/ui/card';
import { type CalculoResultado } from '../types/calculadora';

interface ResultadoCalculadoraProps {
  resultado: CalculoResultado;
}

export const ResultadoCalculadora = ({
  resultado,
}: ResultadoCalculadoraProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${((value - 1) * 100).toFixed(2)}%`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Resultado do Cálculo</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Custos por Componente</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Proteína:</span>
                <span>{formatCurrency(resultado.precoProteina)}</span>
              </div>
              <div className="flex justify-between">
                <span>Carboidratos:</span>
                <span>{formatCurrency(resultado.precoCarboidratos)}</span>
              </div>
              <div className="flex justify-between">
                <span>Legumes:</span>
                <span>{formatCurrency(resultado.precoLegumes)}</span>
              </div>
              <div className="flex justify-between">
                <span>Molho:</span>
                <span>{formatCurrency(resultado.precoMolho)}</span>
              </div>
              <div className="flex justify-between">
                <span>Custo Fixo:</span>
                <span>{formatCurrency(resultado.precoFixo)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Margens e Taxas</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Lucro:</span>
                <span>{formatPercentage(resultado.lucro)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa Cartão:</span>
                <span>{formatPercentage(resultado.porcentagemCartao)}</span>
              </div>
              <div className="flex justify-between">
                <span>Desperdício:</span>
                <span>
                  {formatPercentage(resultado.porcentagemDesperdicio)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Preço por Marmita:</span>
              <span className="text-green-600">
                {formatCurrency(resultado.precoTotalPorMarmita)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Preço Total:</span>
              <span className="text-green-600">
                {formatCurrency(resultado.precoTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
