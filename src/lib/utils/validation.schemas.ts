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
    type: z.nativeEnum(ListingType, { errorMap: () => ({ message: "type invalide." }) }),
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
    imageUrls: z.array(z.string().url()).optional(),
    // --- CHAMPS DE DATE ---
    availableFrom: z.coerce.date({ required_error: "La date de début de disponibilité est requise." }),
    availableTo: z.coerce.date({ required_error: "La date de fin de disponibilité est requise." }),
}).refine(data => data.availableTo > data.availableFrom, {
    message: "La date de fin doit être après la date de début.",
    path: ["avaiableTo"],
})

// --- SCHÉMA POUR LA CRÉATION DE RÉSERVATION ---
export const createBookingSchema = z.object({
    listingId: z.string().cuid("L'ID du logement est invalide."),
    startDate: z.coerce.date({ required_error: "La date d'arrivée est requise." }),
    endDate: z.coerce.date({ required_error: "La date de départ est requise." }),
}).refine(data => data.endDate > data.startDate, {
    message: "La date de départ doit être après la date d'arrivée.",
    path: ["endDate"], // L'erreur sera associée à ce champ
});


export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CreateListingInput = z.infer<typeof createListingSchema>;
