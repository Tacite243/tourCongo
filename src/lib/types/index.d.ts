import { User as PrismaUser, Role } from '@prisma/client';
import { NextRequest } from 'next/server';
import { Role } from '@prisma/client';


export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}


// Type pour le payload du JWT
export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

export interface UserAuthInfo {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

// Type pour l'utilisateur sans le mot de passe (sécurisé pour l'envoi au client)
export type SafeUser = Omit<PrismaUser, 'password'>;