import { Role, User as PrismaUser } from '@prisma/client';
import type { JWTPayload as JoseJWTPayload } from 'jose';



export interface TokenSignPayload {
  id: string;
  email: string;
  role: Role;
}


export interface JwtPayload extends JoseJWTPayload, TokenSignPayload {
  // Les champs de TokenSignPayload sont déjà là.
  // JoseJWTPayload ajoute exp, iat, etc.
}

// Informations utilisateur renvoyées par les API ou stockées dans Redux
// Cela doit correspondre aux champs que vous voulez exposer du modèle User de Prisma
export interface UserAuthInfo {
  id: string;
  email: string;
  name?: string | null;       // Champ du modèle User
  avatarUrl?: string | null;  // Champ du modèle User
  phone?: string | null;      // Champ du modèle User
  bio?: string | null;        // Champ du modèle User
  role: Role;
  // Ajoutez d'autres champs si nécessaire, mais gardez-le léger pour l'auth
}

// Type SafeUser, dérivé de UserAuthInfo (ou directement de PrismaUser si vous préférez)
// Si dérivé de PrismaUser, il faut Omit beaucoup plus de champs (relations, password)
// Il est souvent plus simple de définir UserAuthInfo comme la "forme" publique de l'utilisateur.
export type SafeUser = UserAuthInfo; // UserAuthInfo est déjà "safe" (sans mot de passe)

// Pour étendre l'objet Request de Next.js dans le middleware
import { NextRequest } from 'next/server';
export interface AuthenticatedRequest extends NextRequest {
  user?: { // Ce 'user' est ce que votre middleware attache
    id: string;
    email: string;
    role: Role;
    name?: string | null; // Peut aussi être inclus ici si vous l'ajoutez au payload du token
  };
}