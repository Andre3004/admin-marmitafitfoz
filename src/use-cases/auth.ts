import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(4, 'Senha deve ter pelo menos 4 caracteres')
})

export type LoginFormData = z.infer<typeof loginSchema>