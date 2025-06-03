import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { registerSchema } from '@/lib/utils/validation.schemas';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body); // Valide et type les données

    const user = await authService.register(validatedData);
    return NextResponse.json({ message: 'Utilisateur enregistré avec succès', user }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation échouée', errors: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      // Gérer les erreurs spécifiques comme "email déjà utilisé"
      if (error.message.includes('existe déjà')) {
        return NextResponse.json({ message: error.message }, { status: 409 }); // 409 Conflict
      }
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}