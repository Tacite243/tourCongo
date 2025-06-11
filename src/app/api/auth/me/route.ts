import { NextResponse, NextRequest } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { UserAuthInfo } from '@/lib/types'; // Le type de retour attendu pour Redux

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    console.warn("[API /me] x-user-id header manquant. Le middleware n'a pas fonctionné comme prévu.");
    return NextResponse.json({ message: 'Non autorisé : Informations utilisateur manquantes' }, { status: 401 });
  }

  try {
    const user = await authService.getUserById(userId); // Ce service doit retourner UserAuthInfo ou null

    if (!user) {
      // Cela peut arriver si l'utilisateur a été supprimé de la DB mais que le token est toujours techniquement valide
      // ou si l'ID dans le token est corrompu.
      console.warn(`[API /me] Utilisateur non trouvé en base de données pour l'ID: ${userId}`);
      return NextResponse.json({ message: 'Non autorisé : Utilisateur introuvable' }, { status: 401 });
    }

    // 'user' devrait être de type UserAuthInfo (ou SafeUser) comme défini dans les types
    return NextResponse.json({ user: user as UserAuthInfo });

  } catch (error) {
    console.error('[API /me] Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur lors de la récupération des informations utilisateur' }, { status: 500 });
  }
}