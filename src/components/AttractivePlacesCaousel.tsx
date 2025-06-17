"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Info, ExternalLink } from 'lucide-react'; // Ajout de ExternalLink

interface Place {
    id: string;
    name: string;
    imageUrl: string;
    tagline?: string; // Un slogan court pour chaque lieu
    description: string;
    link?: string;
}

const attractivePlaces: Place[] = [
    {
        id: '1',
        name: 'Parc National des Virunga',
        imageUrl: '/virunga.jpeg',
        tagline: 'Terre des Géants Volcaniques',
        description: 'Site du patrimoine mondial de l\'UNESCO, célèbre pour ses gorilles de montagne et ses volcans actifs majestueux.',
        link: '/virunga'
    },
    {
        id: '2',
        name: 'Chutes de la Lofoyi',
        imageUrl: '/lofoyi.jpeg',
        tagline: 'La Symphonie Aquatique',
        description: 'Des chutes d\'eau spectaculaires offrant des paysages à couper le souffle, une immersion totale dans la puissance de la nature.',
    },
    {
        id: '3',
        name: 'Fleuve Congo',
        imageUrl: '/fleuve-congo.jpeg',
        tagline: 'L\'Artère Vitale de l\'Afrique',
        description: 'Le deuxième plus long fleuve d\'Afrique, offrant des croisières mémorables au cœur d\'une biodiversité foisonnante.',
    },
    {
        id: '4',
        name: 'Parc National de la Salonga',
        imageUrl: '/salonga.jpeg',
        tagline: 'Le Poumon Vert Intact',
        description: 'La plus grande réserve de forêt tropicale humide d\'Afrique, sanctuaire des bonobos et des éléphants de forêt.',
    },
    {
        id: '5',
        name: 'Mont Nyiragongo',
        imageUrl: '/nyiragongo.jpeg',
        tagline: 'Le Cœur Ardent du Kivu',
        description: 'Un volcan actif avec l\'un des plus grands lacs de lave permanents au monde. Une ascension nocturne inoubliable.',
        link: '/nyiragongo'
    },
    {
        id: '6',
        name: 'Lola ya Bonobo',
        imageUrl: '/lola-ya-bonobo.jpeg',
        tagline: 'Le Paradis des Bonobos',
        description: 'Sanctuaire unique au monde dédié à la compassion et à la conservation des bonobos orphelins.',
    },
];

const OPTIONS: EmblaOptionsType = { loop: true, align: 'start', dragFree: true };

export default function AttractivePlacesCarousel() {
    const autoplay = useRef(
        Autoplay({
            delay: 4500, // Légèrement plus long pour laisser le temps d'admirer
            stopOnInteraction: true, // Permet à l'utilisateur de stopper avec un drag
            stopOnMouseEnter: true,
            rootNode: (emblaRoot) => emblaRoot.parentElement,
        })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [autoplay.current]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev(); }, [emblaApi]);
    const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext(); }, [emblaApi]);

    useEffect(() => {
        return () => { if (autoplay.current) autoplay.current.destroy(); };
    }, []);

    if (!attractivePlaces || attractivePlaces.length === 0) return null;

    return (
        <section
            className="py-20 sm:py-28 bg-gradient-to-b from-background via-slate-900/10 dark:via-slate-50/5 to-background text-foreground overflow-hidden" // Ajout de overflow-hidden ici
            // Animation d'entrée pour toute la section
            data-aos="zoom-in-up"
            data-aos-duration="1200"
            data-aos-easing="ease-out-cubic"
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 sm:mb-16">
                    <h2
                        className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-sky-500"
                        data-aos="fade-down"
                        data-aos-delay="200"
                        data-aos-duration="1000"
                    >
                        Joyaux Incontournables de la RDC
                    </h2>
                    <p
                        className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                        data-aos="fade-up"
                        data-aos-delay="400"
                        data-aos-duration="1000"
                    >
                        Plongez au cœur d'une terre de merveilles, où chaque paysage raconte une épopée et chaque rencontre est une inspiration.
                    </p>
                </div>

                <div className="relative group" data-aos="fade-up" data-aos-delay="600" data-aos-duration="1200">
                    <div className="overflow-hidden rounded-xl py-2" ref={emblaRef}> {/* py-2 pour voir l'ombre */}
                        <div className="flex -ml-4">
                            {attractivePlaces.map((place, index) => (
                                <div
                                    className="relative flex-[0_0_90%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] xl:flex-[0_0_22%] pl-4 group/slide"
                                    key={place.id}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    // Animation AOS pour chaque carte avec un décalage
                                    data-aos="zoom-in"
                                    data-aos-delay={100 + index * 100} // Délai progressif pour un effet de "stagger"
                                    data-aos-duration="800"
                                    data-aos-anchor-placement="top-bottom" // Déclenche quand le haut de l'élément atteint le bas de la fenêtre
                                >
                                    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out transform hover:scale-[1.03] hover:shadow-cyan-500/30 dark:hover:shadow-cyan-400/20 cursor-pointer">
                                        <Image
                                            src={place.imageUrl}
                                            alt={place.name}
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition-transform duration-700 ease-in-out group-hover/slide:scale-[1.15]"
                                            quality={80}
                                            sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-100 group-hover/slide:opacity-60 transition-opacity duration-500"></div>

                                        {/* Titre et Slogan */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white z-[5] transition-transform duration-500 ease-out group-hover/slide:translate-y-[-10px]">
                                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{place.name}</h3>
                                            {place.tagline && <p className="text-sm text-sky-300/90 font-medium mt-1 opacity-90 group-hover/slide:opacity-100">{place.tagline}</p>}
                                        </div>

                                        {/* Description au survol (améliorée) */}
                                        <div
                                            className={`absolute inset-0 bg-black/85 backdrop-blur-md p-6 flex flex-col justify-end items-start text-left text-white
                                                        opacity-0 pointer-events-none group-hover/slide:opacity-100 group-hover/slide:pointer-events-auto
                                                        transition-all duration-500 ease-in-out transform group-hover/slide:translate-y-0 translate-y-8
                                                        ${hoveredIndex === index ? 'opacity-100 pointer-events-auto translate-y-0 z-10' : 'opacity-0 translate-y-8'}`}
                                        >
                                            <div> {/* Conteneur pour limiter la hauteur du texte */}
                                                <Info className="w-7 h-7 mb-3 text-primary" />
                                                <h4 className="text-2xl font-semibold mb-2">{place.name}</h4>
                                                <p className="text-[0.9rem] leading-relaxed mb-5 line-clamp-4">{place.description}</p> {/* line-clamp pour limiter le texte */}
                                            </div>
                                            {place.link && (
                                                <a
                                                    href={place.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-auto self-start inline-flex items-center bg-primary hover:bg-primary/80 text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors duration-300 transform hover:scale-105"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Explorer <ExternalLink className="ml-2 h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Boutons de navigation (style amélioré) */}
                    {emblaApi && (
                        <>
                            <button
                                className="absolute top-1/2 left-2 -translate-y-1/2 z-20 p-3 bg-card/60 hover:bg-card text-foreground rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={scrollPrev}
                                aria-label="Précédent"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                className="absolute top-1/2 right-2 -translate-y-1/2 z-20 p-3 bg-card/60 hover:bg-card text-foreground rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                onClick={scrollNext}
                                aria-label="Suivant"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}