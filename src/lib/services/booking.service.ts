import prisma from '@/lib/prisma';
import { Booking } from '@prisma/client';
import { CreateBookingInput } from '../utils/validation.schemas';

export const bookingService = {
    /**
     * Crée une nouvelle réservation pour un utilisateur.
     * @param data - Les données de la réservation (listingId, dates).
     * @param userId - L'ID de l'utilisateur qui réserve.
     */
    async create(data: CreateBookingInput, userId: string): Promise<Booking> {
        const { listingId, startDate, endDate } = data;

        // Étape 1: Récupérer les informations du logement et vérifier les conditions
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            throw new Error("Logement non trouvé.");
        }

        // --- RÈGLE MÉTIER 1 : L'HÔTE NE PEUT PAS RÉSERVER SON PROPRE LOGEMENT ---
        if (listing.hostId === userId) {
            throw new Error("Vous ne pouvez pas réserver votre propre logement.");
        }

        // --- RÈGLE MÉTIER 2 : VÉRIFIER LA DISPONIBILITÉ ---
        // Vérifier s'il existe déjà une réservation qui chevauche les dates demandées
        const existingBooking = await prisma.booking.findFirst({
            where: {
                listingId: listingId,
                // Condition de chevauchement de dates
                AND: [
                    { startDate: { lt: endDate } },
                    { endDate: { gt: startDate } },
                ],
            },
        });

        if (existingBooking) {
            throw new Error("Ces dates ne sont plus disponibles pour ce logement.");
        }

        // Étape 2: Calculer le prix total
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (nights <= 0) {
            throw new Error("La durée du séjour doit être d'au moins une nuit.");
        }
        const totalPrice = nights * listing.price;

        // Étape 3: Créer la réservation dans la base de données
        const newBooking = await prisma.booking.create({
            data: {
                startDate,
                endDate,
                totalPrice,
                listing: { connect: { id: listingId } },
                user: { connect: { id: userId } },
            },
        });

        return newBooking;
    },
};