import { NextResponse } from 'next/server';
import { AuthenticatedRequest } from '@/lib/types'; // Type étendu pour la requête

export async function GET(request: AuthenticatedRequest) {
  // Le middleware aura déjà vérifié le token et attaché 'request.user'
  if (!request.user) {
    // Cela ne devrait pas arriver si le middleware fonctionne correctement
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  // request.user contient { id, email, role }
  return NextResponse.json({ user: request.user });
}