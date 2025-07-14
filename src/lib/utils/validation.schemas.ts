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


export const createListingSchema = z.object({
    title: z.string().min(5, "Le titre doit faire au moins 5 caractères."),
    description: z.string().min(20, "La description doit faire au moins 20 caractères."),
    type: z.string().min(1, "Le type de logement est requis."),
    price: z.coerce.number().positive("Le prix doit être un nombre positif."),
    address: z.string().min(10, "L'adresse doit être plus précise."),
    city: z.string().min(2, "La ville est requise."),
    country: z.string().min(2, "Le pays est requis."),
    // Pour la simplicité, latitude/longitude ne sont pas requis dans le formulaire initial
    // Ils pourraient être calculés à partir de l'adresse plus tard.
    amenities: z.array(z.string()).min(1, "Veuillez sélectionner au moins un équipement."),
    maxGuests: z.coerce.number().int().positive("Le nombre de voyageurs doit être au moins 1."),
    bedrooms: z.coerce.number().int().min(0, "Le nombre de chambres ne peut être négatif."),
    bathrooms: z.coerce.number().int().min(0, "Le nombre de salles de bain ne peut être négatif."),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;