import type {
  Marmita,
  Fixo,
  CalculoResultado,
} from '../pages/calculadora/types/calculadora';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export const calculadoraUseCases = {
  async getFixo(): Promise<Fixo> {
    const response = await fetch(`${API_BASE_URL}/api/fixo`);

    if (!response.ok) {
      throw new Error('Erro ao buscar dados fixos');
    }

    return (await response.json()).data;
  },

  calcularPrecoMarmita(marmita: Marmita, fixo?: Fixo): CalculoResultado {
    const precoPorProteina = {
      CARNE: fixo?.precoCarneKg || 0,
      FRANGO: fixo?.precoFrangoKg || 0,
      PEIXE: fixo?.precoPeixeKg || 0,
    };

    const precoPorCarboidrato = {
      ARROZ: fixo?.arrozPorMarmita || 0,
      BATATA_INGLESA: fixo?.batataInglessaPorMarmita || 0,
      BATATA_DOCE: fixo?.batataDocePorMarmita || 0,
      FEIJAO: fixo?.feijaoPorMarmita || 0,
      MACARRAO: fixo?.arrozPorMarmita || 0,
    };

    const precoProteina =
      ((precoPorProteina[marmita.proteina.tipo] || 0) *
        marmita.proteina.quantidade) /
      1000;

    const precoCarboidratos = marmita.carboidratos
      .map(
        carbo =>
          ((precoPorCarboidrato[carbo.tipo] || 0) * carbo.quantidade) / 100
      )
      .reduce((acc, curr) => acc + curr, 0);

    const precoLegumes =
      ((fixo?.legumesPorMarmita || 0) * (marmita?.mixLegumesQuantidade || 0)) /
      100;
    const precoMolho = fixo?.molho || 0;
    const precoFixo = fixo?.custoGeral || 0;

    const lucro = (fixo?.lucro || 0) / 100 + 1;
    const porcentagemCartao = (fixo?.porcentagemCartao || 0) / 100 + 1;
    const porcentagemDesperdicio =
      (fixo?.porcentagemDesperdicio || 0) / 100 + 1;

    const precoTotalPorMarmita =
      (precoProteina +
        precoCarboidratos +
        precoLegumes +
        precoMolho +
        precoFixo) *
      lucro *
      porcentagemCartao *
      porcentagemDesperdicio;

    return {
      precoProteina,
      precoCarboidratos,
      precoLegumes,
      precoMolho,
      precoFixo,
      porcentagemCartao,
      porcentagemDesperdicio,
      lucro,
      precoTotal: precoTotalPorMarmita * marmita.quantidade,
      precoTotalPorMarmita,
    };
  },
};
