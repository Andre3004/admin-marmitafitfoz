import { create } from 'zustand'

interface User
{
  id: string
  email: string
  name: string
}

interface AuthState
{
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const HOST = import.meta.env.VITE_API_HOST

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('auth-token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) =>
  {
    set({ isLoading: true, error: null })

    try
    {
      const response = await fetch(`${HOST}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email, password }),
      })

      if (!response.ok)
      {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao fazer login')
      }

      const data = await response.json()

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })

      localStorage.setItem('auth-token', data.jwt)
      window.location.href = '/dashboard'
    } catch (error)
    {
      set({
        error: error instanceof Error ? error.message : 'Erro ao fazer login',
        isLoading: false
      })
    }
  },

  logout: () =>
  {
    localStorage.removeItem('auth-token')
    set({
      user: null,
      isAuthenticated: false,
      error: null
    })
  },

  clearError: () =>
  {
    set({ error: null })
  }
}))