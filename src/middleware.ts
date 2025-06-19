export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/utils/auth.utils';
import { JwtPayload } from '@/lib/types';
import { Role } from '@prisma/client';

const protectedRoutes = ['/api/auth/me', '/api/admin', '/api/listings'];
const adminRoutes = ['/api/admin'];
const superAdminRoutes = ['/api/superadmin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('auth_token');
  const token = tokenCookie?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route));

  let userPayload: JwtPayload | null = null;

  if (token) {
    // console.log('[Middleware] Token found in cookie:', token);
    userPayload = await verifyToken(token); // Utilise jose, donc async
    // console.log('[Middleware] Payload from verifyToken:', userPayload);
  }

  if (isProtectedRoute || isAdminRoute || isSuperAdminRoute) {
    if (!userPayload?.id) { // Vérifier la présence de l'ID dans le payload
      console.warn(`[Middleware] No valid user payload for protected route: ${pathname}. Token was: ${token ? 'present' : 'absent'}`);
      return NextResponse.json({ message: 'Non autorisé : Session invalide ou expirée' }, { status: 401 });
    }

    // Vérification des rôles
    if (isSuperAdminRoute && userPayload.role !== Role.SUPER_ADMIN) {
      // ... (log et réponse 403)
      return NextResponse.json({ message: 'Accès interdit : Privilèges Super Admin requis' }, { status: 403 });
    }
    if (isAdminRoute && userPayload.role !== Role.ADMIN && userPayload.role !== Role.SUPER_ADMIN) {
      // ... (log et réponse 403)
      return NextResponse.json({ message: 'Accès interdit : Privilèges Admin requis' }, { status: 403 });
    }

    // Préparer les nouveaux headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userPayload.id);
    // Optionnel: vous pouvez toujours passer le rôle si certaines routes en ont besoin directement
    // sans refaire une requête DB, mais pour /me, l'ID suffit.
    // requestHeaders.set('x-user-role', userPayload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/auth/me/:path*',
    '/api/admin/:path*',
    '/api/superadmin/:path*',
    '/api/listings/:path*',
  ],
};