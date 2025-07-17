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
        const { imageUrls, availableFrom, availableTo, ...listingData } = data;
        const newListing = await prisma.$transaction(async (tx) => {
            // Etape 1 : créer le logement
            const createdListing = await tx.listing.create({
                data: {
                    ...listingData,
                    host: {
                        connect: { id: hostId }
                    },
                },
            });
            // Étape 2 : Préparer les données pour les photos
            if (!imageUrls || imageUrls.length === 0) {
                // Cette validation est déjà dans Zod, mais c'est une sécurité supplémentaire.
                throw new Error("Au moins une image est requise");
            }
            const photoData = imageUrls.map(url => ({
                url,
                listingId: createdListing.id,
            }));
            // Étape 3 : Créer les enregistrements de photos
            await tx.photo.createMany({
                data: photoData,
            });
            // Étape 4 : Logique de disponibilité
            await tx.availability.create({
                data: {
                    listingId: createdListing.id,
                    startDate: availableFrom,
                    endDate: availableTo,
                }
            });
            // Retourner le logement créé pour confirmation
            return createdListing;
        });
        // Après la transaction, on peut récupérer le logement complet avec ses relations
        // si nécessaire, mais pour la réponse de l'API, `newListing` est suffisant.
        return newListing;
    },
    async findByHostId(hostId: string) {
        const listings = await prisma.listing.findMany({
            where: {
                hostId: hostId,
            },
            include: {
                // Inclure la première photo pour l'afficher dans le dashboard
                photos: {
                    take: 1,
                },
                // On pourrait aussi inclure les statistiques de réservation ici si nécessaire
                _count: {
                    select: {
                        bookings: true, // Compter le nombre de réservations
                        reviews: true,  // Compter le nombre d'avis
                        likes: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return listings;
    },
    async findRecent(limit: number = 4) {
        const listings = await prisma.listing.findMany({
            take: limit, // limit le nombre des résultats
            orderBy: {
                createdAt: 'desc', // Trie par date de création, du plus récent au plus ancien
            },
            include: {
                photos: {
                    take: 1,
                },
                // Pas besoin des détails de l'hôte pour la carte de la page d'accueil,
                // mais on pourrait les ajouter si nécessaire.
            },
        });
        return listings;
    }
};