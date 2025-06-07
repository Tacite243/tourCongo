// src/lib/types/index.d.ts
import { Role } from '@prisma/client'; // Assurez-vous que ce chemin est correct
import type { JWTPayload as JoseJWTPayload } from 'jose'; // Importer le type de base de jose

// Ce que vous mettez DANS le token lors de la génération
export interface TokenSignPayload {
  id: string;
  email: string;
  role: Role;
  // Vous pouvez ajouter d'autres claims personnalisés ici si nécessaire
}

// Ce que vous attendez APRÈS la vérification du token.
// Il contiendra vos claims personnalisés ET les claims standards de JWT (comme exp, iat).
export interface JwtPayload extends JoseJWTPayload, TokenSignPayload {
  // TokenSignPayload contient déjà id, email, role.
  // JoseJWTPayload ajoute les champs standards comme exp, iat, etc.
  // Si vous avez d'autres champs obligatoires DANS LE PAYLOAD VERIFIE qui ne sont ni dans
  // TokenSignPayload ni dans JoseJWTPayload, ajoutez-les ici.
  // Par exemple, si vous mettiez un `name` directement dans le token:
  // name?: string;
}


// UserAuthInfo et SafeUser (si pas déjà définis ailleurs)
export interface UserAuthInfo {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
}
export type SafeUser = Omit<UserAuthInfo, 'password'>;

// Pour étendre l'objet Request de Next.js dans le middleware
import { NextRequest } from 'next/server';
export interface AuthenticatedRequest extends NextRequest {
  user?: { // Ce 'user' est ce que votre middleware attache
    id: string;
    email: string;
    role: Role;
  };
}