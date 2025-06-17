"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlayCircle, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
    videoSrc: string;
    title: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    showPlayButton?: boolean;
}

export function HeroSection({
    videoSrc = '/videos/vid.mp4',
    title,
    subtitle,
    ctaText = "Découvrir",
    ctaLink = "/logements",
    showPlayButton = false,
}: HeroSectionProps) {
    return (
        // Utiliser min-h-screen pour s'assurer qu'elle prend au moins toute la hauteur de la fenêtre
        // w-full pour prendre la largeur du conteneur parent (main, qui est 100vw)
        // La section elle-même est relative pour que les éléments absolus à l'intérieur soient positionnés par rapport à elle.
        <section className="relative min-h-screen w-full overflow-hidden">
            <div className="absolute inset-0 z-0"> {/* Conteneur pour la vidéo */}
                <video
                    className="w-full h-full object-cover" // object-cover s'assure que la vidéo couvre sans déformer
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={videoSrc}
                // poster="/images/hero-poster.jpg" // Image de remplacement avant/pendant le chargement de la vidéo
                >
                    Votre navigateur ne supporte pas la balise vidéo.
                </video>
            </div>

            {/* Dégradé pour la lisibilité du texte par-dessus la vidéo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>

            {/* Contenu textuel et CTA */}
            <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center text-white p-4 md:p-8">
                {/* Ajouter un conteneur avec max-width pour le contenu si nécessaire */}
                <div className="max-w-4xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg animate-fade-in-down">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-md animate-fade-in-up delay-200">
                            {subtitle}
                        </p>
                    )}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
                        {ctaText && ctaLink && (
                            <Link href={ctaLink} passHref>
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 sm:py-4 rounded-full group shadow-lg hover:shadow-xl transition-shadow">
                                    {ctaText}
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        )}
                        {showPlayButton && (
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/80 text-white hover:bg-white/10 hover:text-white text-lg px-8 py-3 sm:py-4 rounded-full group shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm bg-white/5"
                                onClick={() => alert("Ouvrir le lecteur vidéo ou une modale")}
                            >
                                <PlayCircle className="mr-2 h-6 w-6 transition-transform group-hover:scale-110" />
                                Voir la vidéo
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};