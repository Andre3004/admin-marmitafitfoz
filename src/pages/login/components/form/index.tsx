import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../../../shared/store/useAuthStore'
import { loginSchema, type LoginFormData } from '../../../../use-cases/auth'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useState } from 'react'
import { Button } from '../../../../components/ui/button'
import { Alert, AlertDescription } from '../../../../components/ui/alert'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { isLoading, error, login, clearError } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password)
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Faça seu login
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Entre com suas credenciais para acessar o sistema
        </p>
      </div>

      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
                  className="float-right h-auto p-0 text-red-600 hover:text-red-800"
                >
                  ×
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}