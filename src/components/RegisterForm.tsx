"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  registerUser,
  selectAuthLoading,
  selectAuthError,
  selectRegistrationSuccess,
  clearAuthError,
  resetRegistrationSuccess
} from '@/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const registrationSuccess = useSelector(selectRegistrationSuccess);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Gérer l'affichage du message de succès et la redirection/réinitialisation
  useEffect(() => {
    if (registrationSuccess) {
      // Option 1: Afficher un message et rediriger vers la page de connexion
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      dispatch(resetRegistrationSuccess()); // Réinitialiser le flag

      // Option 2: Juste afficher un message et l'utilisateur peut cliquer sur un lien vers la connexion
      // Le message pourrait être un composant plus élégant qu'une alerte.
    }
  }, [registrationSuccess, dispatch/*, router*/]);

  // Effacer les erreurs lorsque le composant est monté ou lorsque les identifiants changent
  useEffect(() => {
    if (authError) {
      dispatch(clearAuthError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password, name]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      alert("L'email et le mot de passe sont requis.");
      return;
    }
    dispatch(registerUser({ email, password, name: name || undefined })) // name est optionnel
      .unwrap()
      .then((
        // createdUser
      ) => {
        console.log('Inscription réussie !');
        // Le useEffect ci-dessus gérera l'affichage du message de succès.
        // Pas besoin de définir l'utilisateur dans l'état ici, car il n'est pas connecté.
      })
      .catch((errorPayload) => {
        console.error('Échec de l\'inscription via le formulaire:', errorPayload);
        // L'erreur est déjà dans state.auth.error
      });
  };

  if (registrationSuccess && !authError) { // Afficher le message de succès si aucune erreur
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-green-600">Inscription Réussie !</h2>
        <p className="mt-2">Vous pouvez maintenant vous connecter avec vos identifiants.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="register-name">Nom (Optionnel)</Label>
        <Input
          id="register-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="register-password">Mot de passe</Label>
        <Input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8} // Correspond à la validation Zod
          disabled={isLoading}
        />
      </div>
      {authError && <p className="text-red-500 text-sm">{authError}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
      </Button>
    </form>
  );
}