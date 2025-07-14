"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';


interface Place {
    id: string; name: string; imageUrl: string; tagline?: string; description: string; link?: string;
}
const attractivePlaces: Place[] = [
    { id: '1', name: 'Parc National des Virunga', imageUrl: '/virunga.jpeg', tagline: 'Terre des Géants Volcaniques', description: "Site du patrimoine mondial de l'UNESCO...", link: '/virunga' },
    { id: '2', name: 'Chutes de la Lofoyi', imageUrl: '/lofoyi.jpeg', tagline: 'La Symphonie Aquatique', description: "Des chutes d'eau spectaculaires..." },
    { id: '3', name: 'Fleuve Congo', imageUrl: '/fleuve-congo.jpeg', tagline: "L'Artère Vitale de l'Afrique", description: "Le deuxième plus long fleuve d'Afrique..." },
    { id: '4', name: 'Parc National de la Salonga', imageUrl: '/salonga.jpeg', tagline: 'Le Poumon Vert Intact', description: "La plus grande réserve de forêt tropicale..." },
    { id: '5', name: 'Mont Nyiragongo', imageUrl: '/nyiragongo.jpeg', tagline: 'Le Cœur Ardent du Kivu', description: "Un volcan actif avec l'un des plus grands lacs de lave..." },
    { id: '6', name: 'Lola ya Bonobo', imageUrl: '/lola-ya-bonobo.jpeg', tagline: 'Le Paradis des Bonobos', description: 'Sanctuaire unique au monde dédié...' },
];

const OPTIONS: EmblaOptionsType = { loop: true, align: 'start' };

export default function AttractivePlacesCarousel() {
    // --- Initialisation Simplifiée ---
    // Le plugin Autoplay est passé directement dans le tableau des plugins.
    // embla-carousel gère son cycle de vie (init, destroy) pour nous.
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [
        Autoplay({
            delay: 4000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    ]);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);


    if (!attractivePlaces || attractivePlaces.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-sky-500" data-aos="fade-down">
                        Joyaux Incontournables de la RDC
                    </h2>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-aos="fade-up">
                        Plongez au cœur d’une terre de merveilles, où chaque paysage raconte une épopée et chaque rencontre est une inspiration.
                    </p>
                </div>

                <div className="relative group" data-aos="fade-up" data-aos-delay="200">
                    <div className="overflow-hidden rounded-xl py-2" ref={emblaRef}>
                        <div className="flex -ml-4">
                            {attractivePlaces.map((place, index) => (
                                <div
                                    className="relative flex-[0_0_90%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4 group/slide"
                                    key={place.id}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out transform hover:scale-[1.03] hover:shadow-cyan-500/30 dark:hover:shadow-cyan-400/20 cursor-pointer">
                                        <Image
                                            src={place.imageUrl}
                                            alt={place.name}
                                            fill
                                            style={{ objectFit: 'cover' }} // Correction de la prop pour Next.js 13+
                                            className="transition-transform duration-700 ease-in-out group-hover/slide:scale-[1.15]"
                                            sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-100 group-hover/slide:opacity-60 transition-opacity duration-500"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white z-[5] transition-transform duration-500 ease-out group-hover/slide:translate-y-[-10px]">
                                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{place.name}</h3>
                                            {place.tagline && <p className="text-sm text-sky-300/90 font-medium mt-1 opacity-90 group-hover/slide:opacity-100">{place.tagline}</p>}
                                        </div>
                                        <div className={cn("absolute inset-0 bg-black/85 backdrop-blur-md p-6 flex flex-col justify-end text-white transition-opacity duration-500 ease-in-out", hoveredIndex === index ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none')}>
                                            {/* Contenu de l'overlay */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Boutons de navigation */}
                    {emblaApi && (
                        <>
                            <button className="absolute top-1/2 left-2 -translate-y-1/2 z-20 p-3 bg-card/60 hover:bg-card text-foreground rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100" onClick={scrollPrev} aria-label="Précédent">
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button className="absolute top-1/2 right-2 -translate-y-1/2 z-20 p-3 bg-card/60 hover:bg-card text-foreground rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100" onClick={scrollNext} aria-label="Suivant">
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}