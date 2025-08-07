import { useEffect } from 'react';
import Layout from '../shared/components/Layout';
import Loading from '../shared/components/Loading';
import { useCalculadora } from './hooks/useCalculadora';
import { CalculadoraForm } from './components/CalculadoraForm';
import { ResultadoCalculadora } from './components/ResultadoCalculadora';

export default function CalculadoraPage() {
  const {
    form,
    fixo,
    resultado,
    isLoading,
    error,
    calcular,
    resetForm,
    clearError,
  } = useCalculadora();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Calculadora de Marmitas' },
  ];

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (isLoading && !fixo) {
    return (
      <Layout title="Calculadora de Marmitas" breadcrumbItems={breadcrumbItems}>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout title="Calculadora de Marmitas" breadcrumbItems={breadcrumbItems}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <CalculadoraForm
              form={form}
              onSubmit={calcular}
              onReset={resetForm}
              isLoading={isLoading}
            />
          </div>

          <div>
            {resultado && <ResultadoCalculadora resultado={resultado} />}
          </div>
        </div>
      </div>
    </Layout>
  );
}
