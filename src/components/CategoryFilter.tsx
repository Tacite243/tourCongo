// src/components/CategoryFilter.tsx
"use client";

import React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ListingType } from '@prisma/client';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react'; // Importer toutes les icônes

// Le type pour une catégorie, tel que défini dans le composant serveur parent.
// C'est le contrat d'interface du composant.
export type Category = {
    label: string;
    value: ListingType;
    // On spécifie que iconName doit être une des clés de l'objet LucideIcons.
    iconName: keyof typeof LucideIcons; 
};

interface CategoryFilterProps {
    categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get('type');

    const handleCategoryClick = (categoryValue: ListingType | null) => {
        const currentParams = new URLSearchParams(searchParams.toString());

        // Si on clique sur la catégorie déjà active, on la désactive.
        if (categoryValue === null || currentCategory === categoryValue) {
            currentParams.delete('type');
        } else {
            currentParams.set('type', categoryValue);
        }

        // Met à jour l'URL sans faire défiler la page.
        router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-4 overflow-x-auto pb-2 -mx-4 px-4">
            {/* Bouton "Tout" */}
            <button
                onClick={() => handleCategoryClick(null)}
                className={cn(
                    "flex flex-shrink-0 items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                    !currentCategory
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground hover:border-primary/50"
                )}
            >
                <span>Tout</span>
            </button>

            {/* Catégories dynamiques */}
            {categories.map(category => {
                // --- CORRECTION CLÉ ---
                // Récupérer le composant icône potentiel depuis l'objet LucideIcons
                const IconComponent = LucideIcons[category.iconName];
                const isSelected = currentCategory === category.value;

                // Valider que IconComponent est un composant React valide avant de l'utiliser.
                // On vérifie que ce n'est ni null, ni undefined, et que c'est bien une fonction ou un objet (ce que sont les composants React).
                if (!IconComponent || typeof IconComponent !== 'function' && typeof IconComponent !== 'object') {
                    // Si l'icône n'est pas trouvée, on utilise une icône par défaut ou on ne rend rien.
                    // LucideIcons.HelpCircle est une bonne icône de secours.
                    const FallbackIcon = LucideIcons.HelpCircle;
                    return (
                        <button key={category.value} disabled className="text-destructive">
                           <FallbackIcon className="h-5 w-5 mr-1" /> Erreur icône
                        </button>
                    );
                }
                
                return (
                    <button
                        key={category.value}
                        onClick={() => handleCategoryClick(category.value)}
                        className={cn(
                            "flex flex-shrink-0 items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                            isSelected
                                ? "border-primary bg-primary text-primary-foreground shadow-md"
                                : "border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground hover:border-primary/50"
                        )}
                    >
                        <IconComponent className="h-5 w-5" />
                        <span>{category.label}</span>
                    </button>
                );
            })}
        </div>
    );
}