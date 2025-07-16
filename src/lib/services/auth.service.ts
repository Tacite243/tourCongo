import prisma from '@/lib/prisma';
import { hashPassword, comparePassword, generateToken } from '@/lib/utils/auth.utils';
import { Role } from '@prisma/client';
import { SafeUser, UserAuthInfo } from '@/lib/types';
import { registerSchema, loginSchema } from '@/lib/utils/validation.schemas';
import { z } from 'zod';


// Type pour les données d'inscription, inféré de Zod
type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export const authService = {
    async register(data: RegisterInput): Promise<SafeUser> {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new Error('Un utilisateur avec cet email existe déjà.');
        }

        const hashedPassword = await hashPassword(data.password);

        // Par défaut, le premier utilisateur est SUPER_ADMIN, les suivants sont USER
        // Logique à adapter selon vos besoins (ex: panel d'admin pour créer d'autres admins)
        const userCount = await prisma.user.count();
        const role = userCount === 0 ? Role.SUPER_ADMIN : Role.USER;

        const newUser = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                role: role,
            },
        });

        const { password, ...safeUser } = newUser;
        return safeUser;
    },

    async login(data: LoginInput): Promise<{ user: SafeUser; token: string }> {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatarUrl: true,
                phone: true,
                bio: true,
                password: true,
            }
        });
        if (!user) {
            throw new Error('Email ou mot de passe incorrect.');
        }

        const isPasswordValid = await comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Email ou mot de passe incorrect.');
        }

        const { password, ...safeUser } = user;
        const token = await generateToken({ id: user.id, email: user.email, role: user.role });

        return { user: safeUser, token };
    },

    async getUserById(id: string): Promise<SafeUser | null> {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatarUrl: true,
                phone: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        if (!user) return null;
        return user as UserAuthInfo;
    },

    async upgradeToHost(userId: string): Promise<{ user: SafeUser; token: string }> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error("Utilisateur non trouvé.");
        }
        if (user.role !== Role.USER) {
            throw new Error("L'utilisateur a déjà un rôle élevé.");
        }

        // Mettre à jour le rôle de l'utilisateur dans la base de données
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: Role.HOST },
        });

        // Générer un NOUVEAU token avec le rôle mis à jour
        const newToken = await generateToken({
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role, // Le nouveau rôle 'HOST'
        });

        // Omettre le mot de passe avant de renvoyer
        const { password, ...safeUser } = updatedUser;

        return { user: safeUser, token: newToken };
    },
};