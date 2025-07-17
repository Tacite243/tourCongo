// src/components/ListingCard.tsx
"use client"; // Ce composant a besoin d'interactivité et d'accéder à Redux

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { ListingSearchResult } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { selectCurrentUser } from '@/redux/slices/authSlice';
import { BookingPopover } from './BookingPopover'; // Importer notre nouveau composant
import { Role } from '@prisma/client';

interface ListingCardProps {
  listing: ListingSearchResult;
}

export function ListingCard({ listing }: ListingCardProps) {
  const currentUser = useSelector(selectCurrentUser);
  const imageUrl = listing.photos?.[0]?.url || '/placeholder-image.jpg';

  // --- LOGIQUE CONDITIONNELLE POUR LE BOUTON ---
  // On n'affiche pas le bouton si :
  // 1. L'utilisateur n'est pas connecté
  // 2. L'utilisateur est le propriétaire (host) du logement
  // 3. L'utilisateur est un ADMIN ou SUPER_ADMIN
  const canBook =
    currentUser &&
    currentUser.id !== listing.hostId &&
    currentUser.role !== Role.ADMIN &&
    currentUser.role !== Role.SUPER_ADMIN;

  return (
    <div className="flex flex-col h-full"> {/* Conteneur flex pour que le bouton pousse le reste */}
      <Link href={`/listings/${listing.id}`} className="group block flex-grow">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <h3 className="font-semibold text-sm truncate">{listing.city}, {listing.country}</h3>
        <p className="text-muted-foreground text-sm truncate">{listing.title}</p>
        <div className="mt-1">
          <span className="font-semibold">{listing.price} €</span>
          <span className="text-sm"> par nuit</span>
        </div>
      </Link>

      {/* Afficher le bouton de réservation uniquement si la condition est remplie */}
      {canBook && (
        <div className="mt-auto pt-2"> {/* mt-auto pousse le bouton vers le bas */}
          <BookingPopover listingId={listing.id} pricePerNight={listing.price} />
        </div>
      )}
    </div>
  );
};


// Composant Squelette pour l'état de chargement
export function ListingCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-auto w-full aspect-square rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}