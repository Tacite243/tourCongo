"use client";

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  searchListings,
  selectAllListings,
  selectListingsLoading,
  selectListingsError
} from '@/redux/slices/listingSlice';

// Importer vos composants d'UI
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';

// Un composant interne pour gérer la logique, afin d'utiliser Suspense
function ListingsContent() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  // Récupérer les données depuis le store Redux
  const listings = useSelector(selectAllListings);
  const isLoading = useSelector(selectListingsLoading);
  const error = useSelector(selectListingsError);

  // Ce useEffect se déclenche lorsque l'URL change (nouvelle recherche)
  useEffect(() => {
    // Extraire les paramètres de l'URL
    const destination = searchParams.get('destination') || undefined;
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    const guestsStr = searchParams.get('guests');

    // Construire l'objet de paramètres pour notre thunk
    const params = {
      destination,
      startDate: startDateStr ? new Date(startDateStr) : undefined,
      endDate: endDateStr ? new Date(endDateStr) : undefined,
      guests: guestsStr ? parseInt(guestsStr, 10) : undefined,
    };
    
    // Déclencher la recherche en dispatchant l'action Redux
    dispatch(searchListings(params));

  }, [searchParams, dispatch]); // Se redéclenche si les paramètres de recherche changent

  // Logique d'affichage conditionnelle
  const renderContent = () => {
    if (isLoading) {
      // Afficher des squelettes pendant le chargement
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 12 }).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-10"><p className="text-destructive">Erreur : {error}</p></div>;
    }

    if (!isLoading && listings.length === 0) {
      return <div className="text-center py-10"><p className="text-muted-foreground">Aucun logement trouvé. Essayez d'ajuster vos critères de recherche.</p></div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {listings.map(listing => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    );
  };
  
  const destinationParam = searchParams.get('destination');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Afficher un titre basé sur la recherche */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Logements {destinationParam ? `à ${destinationParam}` : 'disponibles'}
      </h1>
      <p className="text-muted-foreground mb-6">
        {listings.length > 0 ? `${listings.length} logement${listings.length > 1 ? 's' : ''} trouvé${listings.length > 1 ? 's' : ''}.` : ""}
      </p>
      
      {renderContent()}
    </div>
  );
}


// La page principale qui utilise Suspense pour une meilleure expérience de chargement
export default function ListingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        
        <Suspense fallback={<p>Chargement de la recherche...</p>}>
          <ListingsContent />
        </Suspense>
      </main>
    </div>
  );
}