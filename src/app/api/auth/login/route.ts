import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { loginSchema } from '@/lib/utils/validation.schemas';
import { ZodError } from 'zod';
import { cookies } from 'next/headers'; // Pour Next.js 13 App Router

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const { user, token } = await authService.login(validatedData);

    // Configuration du cookie - Correction ici
    (await cookies()).set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 1, // 1 jour
    });

    return NextResponse.json({ message: 'Connexion réussie', user });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation échouée', errors: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      if (error.message.includes('incorrect')) {
        return NextResponse.json({ message: error.message }, { status: 401 });
      }
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error('Login error:', error); // Log l'erreur pour le débogage
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}