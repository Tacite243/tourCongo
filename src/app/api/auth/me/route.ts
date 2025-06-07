// import { NextResponse } from 'next/server';
// import { AuthenticatedRequest } from '@/lib/types'; // Type étendu pour la requête

// export async function GET(request: AuthenticatedRequest) {
//   // Le middleware aura déjà vérifié le token et attaché 'request.user'
//   if (!request.user) {
//     // Cela ne devrait pas arriver si le middleware fonctionne correctement
//     return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
//   }

//   // request.user contient { id, email, role }
//   return NextResponse.json({ user: request.user });
// }


import { NextResponse, NextRequest } from 'next/server';
import { Role } from '@prisma/client'; // Si vous avez besoin de typer le rôle

export async function GET(request: NextRequest) { // Utiliser NextRequest standard
  const userId = request.headers.get('x-user-id');
  const userEmail = request.headers.get('x-user-email');
  const userRole = request.headers.get('x-user-role') as Role | null; // Caster si nécessaire

  // Ou si vous avez sérialisé tout le payload:
  // const userPayloadString = request.headers.get('x-user-payload');
  // const user = userPayloadString ? JSON.parse(userPayloadString) : null;

  if (!userId || !userEmail || !userRole) {
    // Cela signifie que le middleware n'a pas correctement défini les headers,
    // ou qu'on a atteint cette route sans passer par le middleware de la bonne manière.
    return NextResponse.json({ message: 'Informations utilisateur manquantes dans les headers' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: userId,
      email: userEmail,
      role: userRole,
    }
  });
}