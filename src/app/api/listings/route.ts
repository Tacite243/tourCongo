import { NextResponse } from 'next/server';
import { listingService, SearchListingsParams } from '@/lib/services/listing.service';
import { z, ZodError } from 'zod';
import { headers } from 'next/headers';
import { createListingSchema } from '@/lib/utils/validation.schemas';
import { Role } from '@prisma/client';

// --- ROUTE POUR CRÉER UN NOUVEAU LOGEMENT ---
export async function POST(request: Request) {
    const headersList = headers();
    const hostId = (await headersList).get('x-user-id');
    const userRole = (await headersList).get('x-user-role') as Role;

    // Sécurité : Vérifier que l'utilisateur est bien un hôte ou admin
    if (!hostId || (userRole !== 'HOST' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
        return NextResponse.json({ message: 'Non autorisé : Vous devez être un hôte pour créer une annonce.' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const validatedData = createListingSchema.parse(body);
        const newListing = await listingService.create(validatedData, hostId);
        return NextResponse.json(newListing, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ message: 'Données invalides', errors: error.flatten() }, { status: 400 });
        }
        console.error('[POST /api/listings] Erreur:', error);
        return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
    }
}

// --- ROUTE POUR LA RECHERCHE PUBLIQUE DE LOGEMENTS ---
const searchSchema = z.object({
    destination: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    guests: z.coerce.number().int().positive().optional(),
}).refine(data => {
    if (data.startDate && !data.endDate) return false;
    if (data.startDate && data.endDate && data.endDate <= data.startDate) return false;
    return true;
}, {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = Object.fromEntries(searchParams.entries());
        const validation = searchSchema.safeParse(query);

        if (!validation.success) {
            return NextResponse.json({ message: 'Paramètres de recherche invalides', errors: validation.error.flatten() }, { status: 400 });
        }

        const searchParamsForService: SearchListingsParams = validation.data;
        const listings = await listingService.search(searchParamsForService);
        return NextResponse.json(listings);

    } catch (error) {
        console.error('[GET /api/listings] Erreur:', error);
        return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
    }
}