import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ListingSearchResult } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';

interface ListingCardProps {
  listing: ListingSearchResult;
}

export function ListingCard({ listing }: ListingCardProps) {
  // Prend la première photo ou une image par défaut
  const imageUrl = listing.photos?.[0]?.url || '/placeholder-image.jpg'; 

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
        <Image
          src={imageUrl}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Vous pourriez ajouter un bouton favori ici */}
      </div>
      <h3 className="font-semibold text-sm truncate">{listing.city}, {listing.country}</h3>
      <p className="text-muted-foreground text-sm truncate">{listing.title}</p>
      <div className="mt-1">
        <span className="font-semibold">{listing.price} €</span>
        <span className="text-sm"> par nuit</span>
      </div>
    </Link>
  );
}

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