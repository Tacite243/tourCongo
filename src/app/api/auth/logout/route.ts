import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    (await cookies()).delete('auth_token');
    return NextResponse.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Erreur lors de la déconnexion' }, { status: 500 });
  }
}