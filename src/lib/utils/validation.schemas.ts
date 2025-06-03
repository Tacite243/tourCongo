import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email({ message: 'Adresse email invalide' }),
    password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
    name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }).optional(),
});

export const loginSchema = z.object({
    email: z.string().email({ message: 'Adresse email invalide' }),
    password: z.string().min(1, { message: 'Le mot de passe est requis' }),
});