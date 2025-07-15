"use client";

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { selectCurrentUser } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ListingForm } from '@/components/ListingForm';

// Vous créerez un service et un slice pour récupérer les annonces de l'hôte
// Pour l'instant, on met un placeholder
type HostListing = { id: string; title: string; city: string; price: number; };

export default function HostDashboardPage() {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [myListings, setMyListings] = useState<HostListing[]>([]); // État pour stocker les annonces

    useEffect(() => {
        // Rediriger si l'utilisateur n'est pas un HOTE ou n'est pas connecté
        if (!currentUser || currentUser.role !== 'HOST') {
            // Optionnellement, vous pouvez montrer une page "Devenez hôte"
            // Pour l'instant, on redirige vers l'accueil
            router.push('/');
        } else {
            // Logique pour récupérer les annonces de l'hôte
            // fetchMyListings(); 
        }
    }, [currentUser, router]);

    if (!currentUser) {
        return <div>Chargement...</div>; // Ou un squelette
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tableau de bord Hôte</h1>
                <Button onClick={() => setIsCreateModalOpen(true)}>Créer une nouvelle annonce</Button>
            </div>

            <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Mes Annonces</h2>
                {myListings.length > 0 ? (
                    <div className="space-y-4">
                        {/* {myListings.map(listing => <ListingManagementCard key={listing.id} listing={listing} />)} */}
                        <p>Liste de vos annonces ici...</p>
                    </div>
                ) : (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Vous n'avez aucune annonce.</p>
                        <Button variant="link" onClick={() => setIsCreateModalOpen(true)} className="mt-2">Créez votre première annonce</Button>
                    </div>
                )}
            </div>

            {/* Modal pour le formulaire de création */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Créer une nouvelle annonce</DialogTitle>
                    </DialogHeader>
                    {/* Le formulaire gère sa propre soumission et fermera le modal via onSuccess */}
                    <ListingForm onSuccess={() => setIsCreateModalOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}