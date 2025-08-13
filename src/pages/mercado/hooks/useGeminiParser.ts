import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ItemCompra {
  nome: string;
  quantidade: number;
}

export interface ListaCompras {
  proteinas: ItemCompra[];
  carboidratos: ItemCompra[];
  legumes: number;
  itensExtras: ItemCompra[];
}

const useGeminiParser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseOrderText = async (orderText: string): Promise<ListaCompras> => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Chave da API Gemini não configurada');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

      const prompt = `
            Você é um assistente virtual especializado em criar listas de compras para uma empresa de marmitas fitness. Sua tarefa é analisar uma lista de pedidos de marmitas, calcular a quantidade total de cada ingrediente necessário com base em uma fórmula específica e, em seguida, gerar uma lista de compras organizada.

            Contexto e Lógica de Cálculo:

            Para calcular a quantidade de cada ingrediente, você deve usar os seguintes multiplicadores para converter o peso do ingrediente na marmita para o peso do ingrediente cru a ser comprado:

            Proteínas: Multiplique a quantidade em gramas por 1.3.

            Exemplo: 150g de frango na marmita exigem 150 * 1.3 = 195g de frango cru.

            Carboidratos:

            Arroz, Feijão, Macarrão: Multiplique a quantidade em gramas por 0.5.

            Batata Doce: Multiplique a quantidade em gramas por 1.0.

            Batata Inglesa: Multiplique a quantidade em gramas por 1.3.

            Legumes (Mix de Legumes): Multiplique a quantidade em gramas por 1.3.

            Formato do Input:

            O input será um texto contendo um ou mais pedidos de marmitas. Cada pedido listará o nome do prato, a quantidade de marmitas e a composição (ingredientes e suas quantidades em gramas).

            Formato do Output:

            Sua resposta deve ser uma lista de compras clara e organizada, dividida nas seguintes categorias:

            Proteínas: Liste cada tipo de proteína e a quantidade total calculada em gramas (g) ou quilogramas (kg)

            Proteinas podem ser apenas: Carne moída, Carne de panela, Coxa sobre coxa, Peito de frango e Peixe. Decida qual é a melhor opção, exemplo: Mini hamburguer deve ser com carne moida, strogonoff com peito de frango, carne de panela com carne, etc.

            Carboidratos: Liste cada tipo de carboidrato e a quantidade total calculada.

            Legumes: Liste a quantidade total de legumes calculada.

            Itens Extras: Sugira itens adicionais que seriam úteis para o preparo das marmitas, como temperos, azeite, requeijão light, etc.

            Resposta (APENAS JSON):

            Exemplo: 
            {
                "proteinas": [
                    {
                        "nome": "Frango",
                        "quantidade": 100
                    }
                ],
                "carboidratos": [
                    {
                        "nome": "Arroz",
                        "quantidade": 100
                    }
                ],
                "legumes": 100,
                "itensExtras": [
                    {
                        "nome": "Azeite",
                        "quantidade": 100
                    }
                ]
            }

            Input: 
            
            ${orderText}
    `;

      const response = await model.generateContent(prompt);
      const responseText = response.response.text();

      try {
        const parsedResponse = JSON.parse(
          responseText
            .replace(/^```json\n?/i, '')
            .replace(/^```\n?/i, '')
            .replace(/```$/i, '')
            .trim()
        );
        return parsedResponse as ListaCompras;
      } catch {
        throw new Error('Erro ao processar resposta JSON do Gemini');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Erro desconhecido ao processar o texto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    parseOrderText,
    isLoading,
    error,
  };
};

export default useGeminiParser;
