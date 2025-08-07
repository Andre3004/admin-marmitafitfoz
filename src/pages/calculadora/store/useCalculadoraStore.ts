import { create } from 'zustand';
import type { Fixo, CalculoResultado } from '../types/calculadora';
import { calculadoraUseCases } from '../../../use-cases/calculadora';

interface CalculadoraState {
  fixo: Fixo | null;
  resultado: CalculoResultado | null;
  isLoading: boolean;
  error: string | null;

  fetchFixo: () => Promise<void>;
  setResultado: (resultado: CalculoResultado) => void;
  clearResultado: () => void;
  clearError: () => void;
}

export const useCalculadoraStore = create<CalculadoraState>(set => ({
  fixo: null,
  resultado: null,
  isLoading: false,
  error: null,

  fetchFixo: async () => {
    set({ isLoading: true, error: null });
    try {
      const fixo = await calculadoraUseCases.getFixo();
      set({ fixo, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Erro ao buscar dados fixos',
        isLoading: false,
      });
    }
  },

  setResultado: (resultado: CalculoResultado) => {
    set({ resultado });
  },

  clearResultado: () => {
    set({ resultado: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
