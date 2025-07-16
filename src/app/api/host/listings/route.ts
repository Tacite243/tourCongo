import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { listingService } from '@/lib/services/listing.service';

// Cette route est dédiée à récupérer les annonces de l'hôte authentifié.
export async function GET() {
    const headersList = headers();
    const hostId = (await headersList).get('x-user-id');

    // Le middleware garantit que cette route n'est accessible que si un token valide est présent.
    if (!hostId) {
        return NextResponse.json({ message: 'Non autorisé : ID de l\'hôte manquant' }, { status: 401 });
    }

    try {
        const hostListings = await listingService.findByHostId(hostId);
        return NextResponse.json(hostListings);
    } catch (error) {
        console.error('[GET /api/host/listings] Erreur:', error);
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
    }
}