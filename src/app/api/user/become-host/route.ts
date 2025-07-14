import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { authService } from "@/lib/services/auth.service";


export async function POST() {
    try {
        const headersList = headers();
        const userId = (await headersList).get('x-user-id');

        if (!userId) {
            return NextResponse.json({
                message: 'Non autorisé : Session requise'
            }, { status: 401 });
        }
        const updatedUser = await authService.upgradeToHost(userId);

        // Renvoyer l'utilisateur mis à jour pour que le frontend puisse mettre à jour l'état Redux
        return NextResponse.json({
            message: 'Félicitations, vous etes maintenant un hote !', user: updatedUser
        });
    } catch (error: any) {
        console.error('[BECOME_HOST_API_ERROR]', error);
        // Gérer les erreurs spécifiques du service
        if (error.message.includes('déjà un rôle élevé')) {
            return NextResponse.json({
                message: error.message
            },
                {
                    status: 400
                });
        }
        return NextResponse.json({
            message: 'Erreur interne du serveur'
        }, { status: 500 })
    }
}