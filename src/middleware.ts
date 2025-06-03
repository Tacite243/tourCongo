import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/utils/auth.utils';
import { AuthenticatedRequest, JwtPayload } from '@/lib/types';
import { Role } from '@prisma/client';

const protectedRoutes = ['/api/auth/me', '/api/admin']; // Routes nécessitant une authentification
const adminRoutes = ['/api/admin']; // Routes nécessitant le rôle ADMIN ou SUPER_ADMIN
const superAdminRoutes = ['/api/superadmin']; // Routes nécessitant le rôle SUPER_ADMIN

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('auth_token');
  const token = tokenCookie?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route));

  let userPayload: JwtPayload | null = null;

  if (token) {
    userPayload = verifyToken(token);
  }

  // Logique de protection des routes
  if (isProtectedRoute || isAdminRoute || isSuperAdminRoute) {
    if (!userPayload) {
      console.log(`[Middleware] No token or invalid token for protected route: ${pathname}`);
      return NextResponse.json({ message: 'Non autorisé : Token manquant ou invalide' }, { status: 401 });
    }

    // Attacher les informations utilisateur à la requête pour les API routes
    // Note: Il faut caster `request` en `AuthenticatedRequest` pour que TypeScript soit content
    // Ceci est une façon de "passer" des données du middleware à la route handler.
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = {
      id: userPayload.id,
      email: userPayload.email,
      role: userPayload.role,
    };
    
    // Vérification des rôles pour les routes spécifiques
    if (isSuperAdminRoute && userPayload.role !== Role.SUPER_ADMIN) {
      console.log(`[Middleware] Forbidden: User ${userPayload.email} (role ${userPayload.role}) tried to access super admin route ${pathname}`);
      return NextResponse.json({ message: 'Accès interdit : Privilèges insuffisants (Super Admin requis)' }, { status: 403 });
    }
    
    if (isAdminRoute && userPayload.role !== Role.ADMIN && userPayload.role !== Role.SUPER_ADMIN) {
      console.log(`[Middleware] Forbidden: User ${userPayload.email} (role ${userPayload.role}) tried to access admin route ${pathname}`);
      return NextResponse.json({ message: 'Accès interdit : Privilèges insuffisants (Admin requis)' }, { status: 403 });
    }
    
    // Si tout est OK pour une route protégée/admin/superadmin, on continue avec la requête enrichie
    return NextResponse.next({
      request: {
        headers: new Headers(request.headers), // Copie les headers originaux
        // On pourrait aussi passer 'user' via un header personnalisé si on préfère
        // 'x-user-payload': JSON.stringify(userPayload)
      },
    });
  }
  
  // Pour les routes publiques, on laisse passer
  return NextResponse.next();
}

// Configurer le matcher pour spécifier sur quelles routes le middleware s'applique
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Mais on veut qu'il s'exécute sur nos routes API.
     */
    '/api/:path*', // Applique à toutes les routes API
    // Ajoutez d'autres chemins si vous avez des pages front-end à protéger de la même manière
  ],
};