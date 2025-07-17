import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { bookingService } from '@/lib/services/booking.service';
import { createBookingSchema } from '@/lib/utils/validation.schemas';
import { ZodError } from 'zod';

export async function POST(request: Request) {
    const headersList = headers();
    const userId = (await headersList).get('x-user-id');

    // Le middleware garantit que l'utilisateur est connecté.
    if (!userId) {
        return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await request.json();
        // Valider les données du corps de la requête
        const validatedData = createBookingSchema.parse(body);

        // Appeler le service avec les données validées et l'ID de l'utilisateur
        const newBooking = await bookingService.create(validatedData, userId);

        return NextResponse.json(newBooking, { status: 201 });

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ message: 'Données de réservation invalides', errors: error.flatten() }, { status: 400 });
        }

        if (error instanceof Error) {
            // Renvoyer les messages d'erreur métier du service (ex: "dates non disponibles")
            return NextResponse.json({ message: error.message }, { status: 409 }); // 409 Conflict est approprié pour un conflit de ressource
        }

        console.error('[BOOKING_POST_ERROR]', error);
        return NextResponse.json({ message: 'Une erreur interne est survenue.' }, { status: 500 });
    }
}