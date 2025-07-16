"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HostListingResult } from '@/redux/slices/listingSlice';
import { Button } from './ui/button';
import { Edit, Trash2, Eye, BarChart2 } from 'lucide-react';

interface HostListingCardProps {
    listing: HostListingResult;
}

export function HostListingCard({ listing }: HostListingCardProps) {
    const imageUrl = listing.photos?.[0]?.url || '/placeholder-image.jpg';

    // Logique pour les boutons (à implémenter)
    const handleEdit = () => alert(`Modifier : ${listing.title}`);
    const handleDelete = () => confirm(`Voulez-vous vraiment supprimer "${listing.title}" ?`);

    return (
        <div className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-40 h-32 md:h-24 aspect-video md:aspect-square rounded-md overflow-hidden flex-shrink-0">
                <Image src={imageUrl} alt={listing.title} fill className="object-cover" />
            </div>
            <div className="flex-grow w-full">
                <h3 className="font-bold truncate">{listing.title}</h3>
                <p className="text-sm text-muted-foreground">{listing.city}, {listing.country}</p>
                <div className="text-sm mt-2 flex items-center gap-4 text-muted-foreground">
                    <span><span className="font-semibold text-foreground">{listing.price} $</span> / nuit</span>
                    <span className="flex items-center gap-1"><BarChart2 size={14} /> {listing._count.bookings} rés.</span>
                </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto justify-end">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/listings/${listing.id}`} target="_blank"><Eye size={16} /></Link>
                </Button>
                <Button variant="outline" size="icon" onClick={handleEdit}>
                    <Edit size={16} />
                </Button>
                <Button variant="destructive" size="icon" onClick={handleDelete}>
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    );
};