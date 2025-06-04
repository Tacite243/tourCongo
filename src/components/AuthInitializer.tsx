"use client";

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchCurrentUser, selectIsAuthenticated } from '@/redux/slices/authSlice'; // Ajustez

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const initialized = useRef(false); // Pour s'assurer que cela ne s'exécute qu'une fois

  useEffect(() => {
    if (!initialized.current && !isAuthenticated) {
      // Tenter de récupérer l'utilisateur seulement si non déjà authentifié dans l'état Redux
      // et si l'initialisation n'a pas encore eu lieu.
    //   console.log("AuthInitializer: Tentative de récupération de l'utilisateur actuel...");
      dispatch(fetchCurrentUser());
      initialized.current = true;
    }
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
}