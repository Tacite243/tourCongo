import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { authService } from "@/lib/services/auth.service";

export async function POST() {
    try {
        const headersList = headers();
        const userId = (await headersList).get('x-user-id');

        if (!userId) {
            return NextResponse.json({ message: 'Non autorisé : Session requise' }, { status: 401 });
        }

        // Le service renvoie maintenant l'utilisateur ET le nouveau token
        const { user: updatedUser, token: newToken } = await authService.upgradeToHost(userId);

        // --- MISE À JOUR DU COOKIE ---
        // Mettre à jour le cookie avec le nouveau token qui contient le rôle 'HOST'
        const threeMonthsInSeconds = 3 * 30 * 24 * 60 * 60;
        (await cookies()).set('auth_token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: threeMonthsInSeconds,
        });
        // --- FIN DE LA MISE À JOUR DU COOKIE ---

        return NextResponse.json({
            message: 'Félicitations, vous êtes maintenant un hôte !',
            user: updatedUser,
        });
    } catch (error: any) {
        console.error('[BECOME_HOST_API_ERROR]', error);
        if (error.message.includes('déjà un rôle élevé')) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
    }
}