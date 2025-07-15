import { z } from 'zod';
import { ListingType } from '@prisma/client';

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
    // Valider par rapport aux valeurs de l'enum Prisma
    type: z.nativeEnum(ListingType, { errorMap: () => ({ message: "Type de logement invalide." }) }),
    price: z.coerce.number().positive("Le prix doit être un nombre positif."),
    address: z.string().min(10, "L'adresse doit être plus précise."),
    city: z.string().min(2, "La ville est requise."),
    country: z.string().min(2, "Le pays est requis."),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    amenities: z.array(z.string()).min(1, "Veuillez sélectionner au moins un équipement."),
    rules: z.string().optional(),
    maxGuests: z.coerce.number().int().positive("Le nombre de voyageurs doit être au moins 1."),
    bedrooms: z.coerce.number().int().min(0, "Le nombre de chambres ne peut être négatif."),
    bathrooms: z.coerce.number().int().min(0, "Le nombre de salles de bain ne peut être négatif."),
    // Les URLs des images viendront du state, pas directement du formulaire
    imageUrls: z.array(z.string().url("URL d'image invalide")).min(1, "Veuillez ajouter au moins une image."),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;