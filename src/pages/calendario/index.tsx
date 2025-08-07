import { Suspense } from 'react';
import Layout from '../shared/components/Layout';
import CalendarioContent from './components/CalendarioContent';
import Loading from '../shared/components/Loading';

export default function CalendarioPage() {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Calendário' },
  ];

  return (
    <Layout title="Calendário de Marmitas" breadcrumbItems={breadcrumbItems}>
      <Suspense fallback={<Loading />}>
        <CalendarioContent />
      </Suspense>
    </Layout>
  );
}
