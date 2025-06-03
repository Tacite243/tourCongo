import { User as PrismaUser, Role } from '@prisma/client';

// Pour étendre l'objet Request de Next.js dans le middleware
import { NextRequest } from 'next/server';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

// Type pour l'utilisateur sans le mot de passe (sécurisé pour l'envoi au client)
export type SafeUser = Omit<PrismaUser, 'password'>;

// Type pour le payload du JWT
export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}