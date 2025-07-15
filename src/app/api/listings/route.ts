import { NextResponse } from 'next/server';
import { listingService, SearchListingsParams } from '@/lib/services/listing.service';
import { z, ZodError } from 'zod';
import { headers } from 'next/headers';
import { createListingSchema } from '@/lib/utils/validation.schemas';
import { Role } from '@prisma/client';


export async function POST(request: Request) {
    try {
        const headersList = headers();
        const hostId = (await headersList).get('x-user-id')
        const userRole = (await headersList).get('x-user-role') as Role;

        // Sécurité : Vérifier que l'utilisateur est bien un hôte ou admin
        if (!hostId || (userRole !== 'HOST' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
            return NextResponse.json({ message: 'Non autorisé : Vous devez être un hôte pour créer une annonce.' }, { status: 403 });
        }

        const body = await request.json();
        const validatedData = createListingSchema.parse(body);
        const newListing = await listingService.create(validatedData, hostId);

        return NextResponse.json(newListing, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ message: 'Données invalides', errors: error.flatten() }, { status: 400 });
        };
        // Logguer l'erreur côté serveur pour le débogage
        console.error('[LISTING_CREATE_ERROR]', error);
        // Renvoyer une réponse d'erreur générique au client
        return NextResponse.json({ message: 'Une erreur interne est survenue. Veuillez réessayer.' }, { status: 500 });
    }
};


// Schéma de validation pour les paramètres de la query
const searchSchema = z.object({
    destination: z.string().optional(),
    // z.coerce convertit automatiquement les chaînes de l'URL en Date/Number
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    guests: z.coerce.number().int().positive().optional(),
}).refine(data => {
    // Si startDate est fourni, endDate doit aussi l'être et être après startDate
    if (data.startDate && !data.endDate) return false;
    if (data.startDate && data.endDate && data.endDate <= data.startDate) return false;
    return true;
}, {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"], // L'erreur sera associée à endDate
});


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = Object.fromEntries(searchParams.entries());

        // 1. Valider les paramètres de la requête avec Zod
        const validation = searchSchema.safeParse(query);

        if (!validation.success) {
            return NextResponse.json({ message: 'Paramètres de recherche invalides', errors: validation.error.flatten() }, { status: 400 });
        }

        // 2. Construire les paramètres pour le service
        const searchParamsForService: SearchListingsParams = {
            destination: validation.data.destination,
            startDate: validation.data.startDate,
            endDate: validation.data.endDate,
            guests: validation.data.guests,
        };

        // 3. Appeler le service
        const listings = await listingService.search(searchParamsForService);

        return NextResponse.json(listings);

    } catch (error) {
        console.error('[LISTINGS_SEARCH_ERROR]', error);
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
    }
}


