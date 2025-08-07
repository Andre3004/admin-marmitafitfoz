import { lazy, Suspense } from 'react';
import Loading from '../shared/components/Loading';

const LoginComponent = lazy(() => import('./components/form'));

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<Loading />}>
        <LoginComponent />
      </Suspense>
    </div>
  );
}
