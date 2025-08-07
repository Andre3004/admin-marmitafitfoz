import { z } from 'zod';

export const TipoProteina = {
  CARNE: 'CARNE',
  FRANGO: 'FRANGO',
  PEIXE: 'PEIXE',
} as const;

export const TipoCarboidrato = {
  ARROZ: 'ARROZ',
  BATATA_INGLESA: 'BATATA_INGLESA',
  BATATA_DOCE: 'BATATA_DOCE',
  FEIJAO: 'FEIJAO',
  MACARRAO: 'MACARRAO',
} as const;

export type TipoProteina = (typeof TipoProteina)[keyof typeof TipoProteina];
export type TipoCarboidrato =
  (typeof TipoCarboidrato)[keyof typeof TipoCarboidrato];

export interface Proteina {
  tipo: TipoProteina;
  quantidade: number;
}

export interface Carboidrato {
  tipo: TipoCarboidrato;
  quantidade: number;
}

export interface Marmita {
  proteina: Proteina;
  carboidratos: Carboidrato[];
  mixLegumesQuantidade: number;
  quantidade: number;
}

export interface Fixo {
  precoCarneKg: number;
  precoFrangoKg: number;
  precoPeixeKg: number;
  arrozPorMarmita: number;
  batataInglessaPorMarmita: number;
  batataDocePorMarmita: number;
  feijaoPorMarmita: number;
  legumesPorMarmita: number;
  molho: number;
  custoGeral: number;
  lucro: number;
  porcentagemCartao: number;
  porcentagemDesperdicio: number;
}

export interface CalculoResultado {
  precoProteina: number;
  precoCarboidratos: number;
  precoLegumes: number;
  precoMolho: number;
  precoFixo: number;
  porcentagemCartao: number;
  porcentagemDesperdicio: number;
  lucro: number;
  precoTotal: number;
  precoTotalPorMarmita: number;
}

export const proteinaSchema = z.object({
  tipo: z.enum(['CARNE', 'FRANGO', 'PEIXE']),
  quantidade: z.number().min(1, 'Quantidade deve ser maior que zero'),
});

export const carboidratoSchema = z.object({
  tipo: z.enum([
    'ARROZ',
    'BATATA_INGLESA',
    'BATATA_DOCE',
    'FEIJAO',
    'MACARRAO',
  ]),
  quantidade: z.number().min(1, 'Quantidade deve ser maior que zero'),
});

export const marmitaSchema = z.object({
  proteina: proteinaSchema,
  carboidratos: z.array(carboidratoSchema),
  mixLegumesQuantidade: z.number().min(1, 'Quantidade deve ser maior que zero'),
  quantidade: z.number().min(1, 'Quantidade deve ser maior que zero'),
});

export type MarmitaFormData = z.infer<typeof marmitaSchema>;
