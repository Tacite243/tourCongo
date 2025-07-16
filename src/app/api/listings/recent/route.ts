import { NextResponse } from 'next/server';
import { listingService } from '@/lib/services/listing.service';

// Handler pour la requête GET
export async function GET() {
    try {
        // Récupère les 4 logements les plus récents via notre service
        const recentListings = await listingService.findRecent(4);
        return NextResponse.json(recentListings);
    } catch (error) {
        console.error('[RECENT_LISTINGS_GET_ERROR]', error);
        return NextResponse.json({ message: 'Erreur interne du serveur lors de la récupération des logements récents.' }, { status: 500 });
    };
}