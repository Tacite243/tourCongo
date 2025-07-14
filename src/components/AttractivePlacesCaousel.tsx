"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay, { AutoplayType } from 'embla-carousel-autoplay'; // Importer AutoplayType
import { ChevronLeft, ChevronRight, Info, ExternalLink } from 'lucide-react';


interface Place {
    id: string;
    name: string;
    imageUrl: string;
    tagline?: string;
    description: string;
    link?: string;
}

const attractivePlaces: Place[] = [
    {
        id: '1',
        name: 'Parc National des Virunga',
        imageUrl: '/virunga.jpeg',
        tagline: 'Terre des Géants Volcaniques',
        description: "Site du patrimoine mondial de l'UNESCO, célèbre pour ses gorilles de montagne et ses volcans actifs majestueux.",
        link: '/virunga'
    },
    {
        id: '2',
        name: 'Chutes de la Lofoyi',
        imageUrl: '/lofoyi.jpeg',
        tagline: 'La Symphonie Aquatique',
        description: "Des chutes d'eau spectaculaires offrant des paysages à couper le souffle, une immersion totale dans la puissance de la nature.",
    },
    {
        id: '3',
        name: 'Fleuve Congo',
        imageUrl: '/fleuve-congo.jpeg',
        tagline: "L'Artère Vitale de l'Afrique",
        description: "Le deuxième plus long fleuve d'Afrique, offrant des croisières mémorables au cœur d'une biodiversité foisonnante.",
    },
    {
        id: '4',
        name: 'Parc National de la Salonga',
        imageUrl: '/salonga.jpeg',
        tagline: 'Le Poumon Vert Intact',
        description: "La plus grande réserve de forêt tropicale humide d'Afrique, sanctuaire des bonobos et des éléphants de forêt.",
    },
    {
        id: '5',
        name: 'Mont Nyiragongo',
        imageUrl: '/nyiragongo.jpeg',
        tagline: 'Le Cœur Ardent du Kivu',
        description: "Un volcan actif avec l'un des plus grands lacs de lave permanents au monde. Une ascension nocturne inoubliable.",
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


const OPTIONS: EmblaOptionsType = { loop: true, align: 'start', dragFree: false /* dragFree à false peut aider Autoplay */ };

export default function AttractivePlacesCarousel() {
    // Stocker l'instance du plugin dans un ref pour y accéder
    const autoplayRef = useRef<AutoplayType | null>(null);

    // Initialiser le plugin Autoplay une seule fois et le stocker
    useEffect(() => {
        // Cette initialisation ne se fera qu'une fois après le premier rendu
        // car le tableau de dépendances est vide.
        autoplayRef.current = Autoplay({
            delay: 3000, // Réduire un peu le délai pour voir plus vite si ça marche
            stopOnInteraction: false, // L'utilisateur peut interagir, autoplay reprendra après mouse leave
            stopOnMouseEnter: true,   // L'autoplay s'arrête quand la souris est sur le carrousel
        });

        // Nettoyage lors du démontage du composant
        return () => {
            if (autoplayRef.current) {
                autoplayRef.current.destroy();
                autoplayRef.current = null;
            }
        };
    }, []);


    const [emblaRef, emblaApi] = useEmblaCarousel(
        OPTIONS,
        // Passer le plugin Autoplay au hook. S'assurer qu'il est initialisé.
        // Si autoplayRef.current est null au premier rendu, on peut passer un tableau vide
        // et réinitialiser embla quand autoplayRef.current est prêt.
        // Cependant, Embla gère bien si un plugin est ajouté/retiré.
        // Pour être sûr, on passe l'instance stockée dans le ref.
        autoplayRef.current ? [autoplayRef.current] : []
    );

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const scrollPrev = useCallback(() => {
        if (emblaApi) {
            emblaApi.scrollPrev();
            if (autoplayRef.current) autoplayRef.current.reset(); // Redémarre le timer de l'autoplay
        }
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) {
            emblaApi.scrollNext();
            if (autoplayRef.current) autoplayRef.current.reset(); // Redémarre le timer de l'autoplay
        }
    }, [emblaApi]);

    // Gérer le survol pour la description et pour potentiellement contrôler l'autoplay
    const handleMouseEnterCard = (index: number) => {
        setHoveredIndex(index);
        // stopOnMouseEnter dans Autoplay devrait gérer l'arrêt.
        // Si vous voulez être plus explicite ou si stopOnMouseEnter ne fonctionne pas comme attendu
        // à cause de la structure des overlays:
        // if (autoplayRef.current) autoplayRef.current.stop();
    };

    const handleMouseLeaveCard = () => {
        setHoveredIndex(null);
        // stopOnMouseEnter dans Autoplay (quand la souris quitte le rootNode) devrait relancer.
        // Pour forcer la reprise si on a stoppé manuellement :
        // if (autoplayRef.current) autoplayRef.current.play();
    };

    // Réinitialiser embla si le plugin autoplay change (ce qui ne devrait arriver qu'une fois ici)
    useEffect(() => {
        if (emblaApi && autoplayRef.current) {
            emblaApi.reInit(OPTIONS, [autoplayRef.current]);
        }
    }, [emblaApi]); // Pas besoin d'inclure autoplayRef.current ici car il est stable


    if (!attractivePlaces || attractivePlaces.length === 0) return null;

    return (
        <section /* ... props de section ... */ >
            <div className="container mx-auto px-4">
                {/* ... Titre et sous-titre ... */}
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
                        Plongez au cœur d’une terre de merveilles, où chaque paysage raconte une épopée et chaque rencontre est une inspiration.
                    </p>
                </div>

                <div className="relative group" data-aos="fade-up" data-aos-delay="600" data-aos-duration="1200">
                    {/* Le conteneur auquel emblaRef est attaché est le rootNode pour stopOnMouseEnter */}
                    <div className="overflow-hidden rounded-xl py-2" ref={emblaRef}>
                        <div className="flex -ml-4">
                            {attractivePlaces.map((place, index) => (
                                <div
                                    className="relative flex-[0_0_90%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] xl:flex-[0_0_22%] pl-4 group/slide"
                                    key={place.id}
                                    onMouseEnter={() => handleMouseEnterCard(index)}
                                    onMouseLeave={handleMouseLeaveCard}
                                    data-aos="zoom-in"
                                    data-aos-delay={100 + index * 100}
                                    data-aos-duration="800"
                                    data-aos-anchor-placement="top-bottom"
                                >
                                    {/* ... Contenu de la carte (Image, titre, description au survol) ... */}
                                    {/* Reste du code de la carte inchangé */}
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

                                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white z-[5] transition-transform duration-500 ease-out group-hover/slide:translate-y-[-10px]">
                                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{place.name}</h3>
                                            {place.tagline && <p className="text-sm text-sky-300/90 font-medium mt-1 opacity-90 group-hover/slide:opacity-100">{place.tagline}</p>}
                                        </div>

                                        <div
                                            className={`absolute inset-0 bg-black/85 backdrop-blur-md p-6 flex flex-col justify-end items-start text-left text-white
                                                        opacity-0 pointer-events-none group-hover/slide:opacity-100 group-hover/slide:pointer-events-auto
                                                        transition-all duration-500 ease-in-out transform group-hover/slide:translate-y-0 translate-y-8
                                                        ${hoveredIndex === index ? 'opacity-100 pointer-events-auto translate-y-0 z-10' : 'opacity-0 translate-y-8'}`}
                                        >
                                            <div>
                                                <Info className="w-7 h-7 mb-3 text-primary" />
                                                <h4 className="text-2xl font-semibold mb-2">{place.name}</h4>
                                                <p className="text-[0.9rem] leading-relaxed mb-5 line-clamp-4">{place.description}</p>
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

                    {/* ... Boutons de navigation ... */}
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
};