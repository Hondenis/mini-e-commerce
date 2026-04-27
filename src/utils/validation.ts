import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3, 'Usuário muito curto'),
  password: z.string().min(4, 'Senha muito curta'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const productSchema = z.object({
  title: z.string().min(2, 'Título obrigatório'),
  price: z.coerce.number().positive('Preço deve ser maior que zero'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category: z.string().min(2, 'Categoria obrigatória'),
  image: z.string().url('URL inválida'),
})
export type ProductInput = z.infer<typeof productSchema>

export const userSchema = z.object({
  username: z.string().min(3, 'Mínimo de 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(4, 'Senha muito curta'),
  firstname: z.string().min(1, 'Nome obrigatório'),
  lastname: z.string().min(1, 'Sobrenome obrigatório'),
  phone: z.string().min(6, 'Telefone inválido'),
  city: z.string().min(2, 'Cidade obrigatória'),
  street: z.string().min(2, 'Rua obrigatória'),
  number: z.coerce.number().int().nonnegative(),
  zipcode: z.string().min(4, 'CEP inválido'),
})
export type UserInput = z.infer<typeof userSchema>
