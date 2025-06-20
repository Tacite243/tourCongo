"use client";

import { Separator } from "@/components/ui/separator";

export function BriefIntroductionSection() {
    return (
        <section className="py-16 sm:py-20 bg-background" data-aos="fade-up" data-aos-duration="1000">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary mb-6">
                    Bienvenue au Cœur Palpitant de l'Afrique
                </h2>
                <Separator className="mx-auto w-12 bg-primary/70 h-1 rounded mb-8" />
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed space-y-4">
                    <span>
                        La République Démocratique du Congo vous attend, terre de contrastes et de merveilles infinies.
                        Un voyage où chaque instant est une découverte, chaque paysage une toile de maître,
                        et chaque rencontre une mélodie pour l'âme.
                    </span>
                    <span className="block mt-4 italic">
                        “Le véritable voyage de découverte ne consiste pas à chercher de nouveaux paysages, mais à avoir de nouveaux yeux.”
                    </span>
                </p>
            </div>
        </section>
    );
}