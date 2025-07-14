"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchCurrentUser, selectIsAuthInitialized } from '@/redux/slices/authSlice';

// composant de chargement simple.

function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[100]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthInitialized = useSelector(selectIsAuthInitialized);

  // Ce useEffect s'exécutera une seule fois après le premier rendu du côté client.
  useEffect(() => {
    // Il n'est pas nécessaire de vérifier isAuthInitialized ici, car ce hook ne se
    // redéclenchera pas de toute façon (tableau de dépendances vide).
    // On dispatche l'action pour vérifier la session au chargement de l'app.
    dispatch(fetchCurrentUser());
  }, [dispatch]); // Le dispatch est stable, donc cela ne s'exécute qu'une fois.

  // Tant que l'authentification n'a pas été vérifiée (c'est-à-dire que le premier
  // fetchCurrentUser n'a pas encore abouti en succès ou en échec), on affiche un loader.
  // Cela empêche l'affichage de l'état "déconnecté" pendant une fraction de seconde
  // et stabilise le montage des composants enfants.
  if (!isAuthInitialized) {
    return <FullPageLoader />;
  }

  // Une fois l'initialisation terminée, on affiche le reste de l'application.
  return <>{children}</>;
}