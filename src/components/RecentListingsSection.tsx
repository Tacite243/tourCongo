"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
    fetchRecentListings,
    selectRecentListings,
    selectIsRecentLoading
} from '@/redux/slices/listingSlice';
import { Button } from './ui/button';
import { ListingCard, ListingCardSkeleton } from './ListingCard';

export function RecentListingsSection() {
    const dispatch = useDispatch<AppDispatch>();
    const recentListings = useSelector(selectRecentListings);
    const isLoading = useSelector(selectIsRecentLoading);

    // Déclencher le fetch des données au premier montage du composant
    useEffect(() => {
        // Pour éviter de re-fetcher si les données sont déjà là (ex: navigation retour)
        // On pourrait ajouter une condition, mais pour la page d'accueil, un fetch au montage est souvent acceptable.
        dispatch(fetchRecentListings());
    }, [dispatch]);

    const renderContent = () => {
        // Affiche les skeletons de chargement
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={i} />)}
                </div>
            );
        }
        // Affiche un message si aucune annonce n'est trouvée
        if (recentListings.length === 0) {
            return (
                <div className="text-center text-muted-foreground py-10">
                    <p>Aucun logement récent à afficher pour le moment. Revenez bientôt !</p>
                </div>
            );
        }
        // Affiche les cartes des logements
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {recentListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing as any} />
                ))}
            </div>
        );
    };

    return (
        <section className="py-16 sm:py-24 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        Nouveaux sur Tour Congo
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Découvrez les derniers logements ajoutés par nos hôtes, prêts à vous accueillir.
                    </p>
                </div>

                {renderContent()}

                <div className="mt-12 text-center">
                    <Button asChild size="lg">
                        <Link href="/listings">Voir tous les logements</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}