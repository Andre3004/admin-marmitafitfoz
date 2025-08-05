import { Suspense, lazy } from 'react'
import Loading from '../shared/components/Loading'

const ClientesContent = lazy(() => import('./components/ClientesContent'))

export default function ClientesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientesContent />
    </Suspense>
  )
}