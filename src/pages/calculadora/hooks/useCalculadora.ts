import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCalculadoraStore } from '../store/useCalculadoraStore';
import { calculadoraUseCases } from '../../../use-cases/calculadora';
import { marmitaSchema, type MarmitaFormData } from '../types/calculadora';

export const useCalculadora = () => {
  const {
    fixo,
    resultado,
    isLoading,
    error,
    fetchFixo,
    setResultado,
    clearResultado,
    clearError,
  } = useCalculadoraStore();

  const form = useForm<MarmitaFormData>({
    resolver: zodResolver(marmitaSchema),
    defaultValues: {
      proteina: {
        tipo: 'FRANGO' as const,
        quantidade: 100,
      },
      carboidratos: [],
      mixLegumesQuantidade: 100,
      quantidade: 1,
    },
  });

  useEffect(() => {
    fetchFixo();
  }, [fetchFixo]);

  const calcular = (data: MarmitaFormData) => {
    if (!fixo) {
      return;
    }

    const resultado = calculadoraUseCases.calcularPrecoMarmita(data, fixo);
    setResultado(resultado);
  };

  const resetForm = () => {
    form.reset();
    clearResultado();
  };

  return {
    form,
    fixo,
    resultado,
    isLoading,
    error,
    calcular,
    resetForm,
    clearError,
  };
};
