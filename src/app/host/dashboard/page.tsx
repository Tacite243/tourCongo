"use client";

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchHostListings, selectHostings, selectListingsLoading } from '@/redux/slices/listingSlice';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ListingForm } from '@/components/ListingForm';
import { HostListingCard } from '@/components/HostListingCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

function HostDashboardContent() {
    const dispatch = useDispatch<AppDispatch>();
    const myListings = useSelector(selectHostings);
    const isLoading = useSelector(selectListingsLoading);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Charger les annonces au montage du composant
    useEffect(() => {
        dispatch(fetchHostListings());
    }, [dispatch]);

    const renderContent = () => {
        if (isLoading && myListings.length === 0) {
            return (
                <div className="space-y-4">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
            );
        }

        if (myListings.length > 0) {
            return (
                <div className="space-y-4">
                    {myListings.map(listing => (
                        <HostListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            );
        }

        return (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Vous n'avez aucune annonce.</p>
                <Button variant="link" onClick={() => setIsCreateModalOpen(true)} className="mt-2">Créez votre première annonce</Button>
            </div>
        );
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tableau de bord Hôte</h1>
                <Button onClick={() => setIsCreateModalOpen(true)}>Créer une nouvelle annonce</Button>
            </div>

            <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Mes Annonces</h2>
                {renderContent()}
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Créer une nouvelle annonce</DialogTitle>
                        <DialogDescription>Remplissez les informations pour publier.</DialogDescription>
                    </DialogHeader>
                    <ListingForm onSuccess={() => setIsCreateModalOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function HostDashboardPage() {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const isAuthInitialized = useSelector((state: RootState) => state.auth.isAuthInitialized);

    useEffect(() => {
        // Attendre que l'authentification soit initialisée avant de prendre une décision
        if (!isAuthInitialized) return;

        if (!currentUser || currentUser.role !== 'HOST') {
            toast.error("Accès non autorisé. Devenez hôte pour accéder à cette page.");
            router.push('/');
        }
    }, [currentUser, isAuthInitialized, router]);

    // Afficher un loader pendant que l'on vérifie l'authentification
    if (!isAuthInitialized) {
        return <div>Vérification de la session...</div>;
    }

    // Si après vérification, l'utilisateur n'est pas un hôte, on n'affiche rien
    if (!currentUser || currentUser.role !== 'HOST') {
        return null;
    }

    // Si tout est bon, on affiche le dashboard
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow pt-20">
                <HostDashboardContent />
            </main>
        </div>
    );
}