import prisma from '@/lib/prisma';
import { Listing, Prisma } from '@prisma/client';
import { CreateListingInput } from '../utils/validation.schemas';


// Type pour les paramètres de recherche
export interface SearchListingsParams {
    destination?: string;
    startDate?: Date;
    endDate?: Date;
    guests?: number;
}

export const listingService = {
    async search(params: SearchListingsParams) {
        const { destination, startDate, endDate, guests } = params;

        const whereClause: Prisma.ListingWhereInput = {};

        // 1. Filtrer par nombre de voyageurs
        if (guests) {
            whereClause.maxGuests = {
                gte: guests, // gte = greater than or equal to
            };
        }

        // 2. Filtrer par destination (recherche textuelle)
        if (destination) {
            whereClause.OR = [
                { city: { contains: destination, mode: 'insensitive' } },
                { country: { contains: destination, mode: 'insensitive' } },
                { title: { contains: destination, mode: 'insensitive' } },
                { description: { contains: destination, mode: 'insensitive' } },
            ];
        }

        // 3. Filtrer par disponibilité (le plus complexe)
        // Nous devons trouver les logements qui N'ONT AUCUNE réservation
        // qui chevauche la période demandée.
        if (startDate && endDate) {
            whereClause.bookings = {
                none: { // 'none' signifie : aucun des enregistrements liés ne doit correspondre à cette condition
                    // Une réservation chevauche si :
                    // (sa date de début est avant notre date de fin) ET (sa date de fin est après notre date de début)
                    AND: [
                        { startDate: { lt: endDate } }, // lt = less than
                        { endDate: { gt: startDate } },   // gt = greater than
                    ],
                },
            };
        }

        // Exécuter la requête
        const listings = await prisma.listing.findMany({
            where: whereClause,
            include: {
                // Inclure les photos pour l'affichage dans les résultats
                photos: {
                    take: 1, // On ne prend que la première photo pour la carte de résultat
                },
                // Inclure l'hôte, mais seulement les informations publiques
                host: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc', // Trier par les plus récents par défaut
            },
        });

        return listings;
    },
    async create(data: CreateListingInput, hostId: string): Promise<Listing> {
        const newListing = await prisma.listing.create({
            data: {
                ...data,
                latitude: 0,
                longitude: 0,
                host: {
                    connect: { id: hostId } // Lier le logement à l'hôte connecté
                }
            }
        });
        return newListing;
    }
};