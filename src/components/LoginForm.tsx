"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { loginUser, selectAuthLoading, selectAuthError, clearAuthError, selectIsAuthenticated } from '@/redux/slices/authSlice'; // Ajustez
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
  }, [isAuthenticated]);

  // Effacer les erreurs lorsque le composant est monté ou lorsque les identifiants changent
  useEffect(() => {
    if (authError) {
      dispatch(clearAuthError());
    }
  }, [email, password, authError, dispatch]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
        // Gérer la validation côté client si nécessaire, bien que Zod le fasse déjà côté backend
        alert("Veuillez remplir l'email et le mot de passe.");
        return;
    }
    // `loginUser` est un thunk, `dispatch` le gérera et mettra à jour l'état.
    // La propriété `unwrap` peut être utilisée pour gérer la promesse retournée par le thunk
    // et obtenir le résultat ou l'erreur directement ici, mais ce n'est pas toujours nécessaire
    // si vous vous fiez uniquement à l'état Redux pour les mises à jour de l'UI.
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        console.log('Connexion réussie !');
        // La redirection peut aussi être gérée ici ou via le useEffect ci-dessus
        // router.push('/dashboard');
      })
      .catch((errorPayload) => {
        // L'erreur est déjà dans state.auth.error, mais on peut la logger ici aussi
        console.error('Échec de la connexion via le formulaire:', errorPayload);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      {authError && <p className="text-red-500 text-sm">{authError}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
      </Button>
    </form>
  );
}