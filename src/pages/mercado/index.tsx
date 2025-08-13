'use client';

import { useState } from 'react';
import useGeminiParser, { type ListaCompras } from './hooks/useGeminiParser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  FiBox,
  FiCheck,
  FiFileText,
  FiLoader,
  FiList,
  FiShoppingCart,
  FiCheckCircle,
} from 'react-icons/fi';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import Breadcrumb from '../shared/components/Breadcrumb';
import Layout from '../shared/components/Layout';

type Quantity = number | string;

function formatQuantity(value: Quantity): string {
  if (typeof value === 'string') {
    return value;
  }
  if (Number.isNaN(value)) {
    return '-';
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} kg`;
  }
  return `${value} g`;
}

const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<any>;
  title: string;
}) => (
  <div className="flex items-center gap-2 text-gray-800">
    <Icon className="h-4 w-4" />
    <span className="font-medium">{title}</span>
  </div>
);

const Mercado = () => {
  const [orderText, setOrderText] = useState('');
  const [output, setOutput] = useState<ListaCompras | null>(null);
  const [copied, setCopied] = useState(false);
  const { parseOrderText, isLoading, error } = useGeminiParser();

  const handleParseOrder = async () => {
    if (!orderText.trim()) {
      return;
    }
    const result = await parseOrderText(orderText);
    setOutput(result);
    setOrderText('');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(output, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Mercado', href: '/mercado' },
  ];

  return (
    <Layout title="Mercado" breadcrumbItems={breadcrumbItems}>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        <>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiShoppingCart className="h-5 w-5" />
                Parser de Pedidos AI
              </CardTitle>
              <CardDescription>
                Cole o texto do pedido e deixe a IA gerar as marmitas
                automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order-text">Texto do Pedido</Label>
                <Textarea
                  id="order-text"
                  placeholder="Cole aqui o texto do pedido de marmitas..."
                  value={orderText}
                  onChange={e => setOrderText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleParseOrder}
                  disabled={!orderText.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <FiFileText className="mr-2 h-4 w-4" />
                      Processar Pedido
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Saída</CardTitle>
                  <CardDescription>Lista de compras organizada</CardDescription>
                </div>
                {!!output && (
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="mt-1"
                  >
                    {copied ? (
                      <>
                        <FiCheck className="mr-2 h-4 w-4" /> Copiado
                      </>
                    ) : (
                      <>
                        <FiList className="mr-2 h-4 w-4" /> Copiar JSON
                      </>
                    )}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {!output && (
                  <div className="text-sm text-gray-500">
                    Nenhuma saída gerada ainda.
                  </div>
                )}

                {!!output && (
                  <div className="space-y-6">
                    {output.proteinas && output.proteinas.length > 0 && (
                      <div className="space-y-3">
                        <SectionHeader icon={FiBox} title="Proteínas" />
                        <div className="divide-y rounded-md border">
                          {output.proteinas.map((item, idx) => (
                            <div
                              key={`prot-${idx}`}
                              className="flex items-center justify-between p-3 text-sm"
                            >
                              <span className="text-gray-800">{item.nome}</span>
                              <span className="font-medium">
                                {formatQuantity(item.quantidade)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {output.carboidratos && output.carboidratos.length > 0 && (
                      <div className="space-y-3">
                        <SectionHeader
                          icon={FiShoppingCart}
                          title="Carboidratos"
                        />
                        <div className="divide-y rounded-md border">
                          {output.carboidratos.map((item, idx) => (
                            <div
                              key={`carb-${idx}`}
                              className="flex items-center justify-between p-3 text-sm"
                            >
                              <span className="text-gray-800">{item.nome}</span>
                              <span className="font-medium">
                                {formatQuantity(item.quantidade)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {typeof output.legumes !== 'undefined' && (
                      <div className="space-y-3">
                        <SectionHeader icon={FiCheckCircle} title="Legumes" />
                        <div className="rounded-md border p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-800">Total</span>
                            <span className="font-medium">
                              {formatQuantity(output.legumes)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {output.itensExtras && output.itensExtras.length > 0 && (
                      <div className="space-y-3">
                        <SectionHeader icon={FiList} title="Itens Extras" />
                        <div className="divide-y rounded-md border">
                          {output.itensExtras.map((item, idx) => (
                            <div
                              key={`extra-${idx}`}
                              className="flex items-center justify-between p-3 text-sm"
                            >
                              <span className="text-gray-800">{item.nome}</span>
                              {/* <span className="font-medium">
                            {formatQuantity(item.quantidade)}
                          </span> */}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!!output && (
                  <div className="rounded-md border bg-gray-50 p-3 text-xs text-gray-700">
                    {JSON.stringify(output, null, 2)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      </div>
    </Layout>
  );
};

export default Mercado;
