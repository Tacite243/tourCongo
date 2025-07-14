"use client";

import React, { useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay'; // Importer Autoplay
import { ChevronLeft, ChevronRight, Star, MessageSquareQuote } from 'lucide-react';

// --- Définition des données (inchangée) ---
interface Testimonial {
    id: string;
    name: string;
    roleOrLocation: string;
    avatarUrl?: string;
    quote: string;
    rating?: number;
}
const testimonials: Testimonial[] = [
    { id: '1', name: 'Aisha K.', roleOrLocation: 'Voyageuse Aventure', avatarUrl: '/images/instagram-05.jpg', quote: 'La montée du Nyiragongo était l’expérience la plus intense de ma vie...', rating: 5 },
    { id: '2', name: 'Dr. Jean Dupont', roleOrLocation: 'Investisseur Touristique', quote: 'Le potentiel de développement touristique durable en RDC est immense...', rating: 4 },
    { id: '3', name: 'Familia Rodriguez', roleOrLocation: 'Explorateurs en Famille', avatarUrl: '/images/instagram-05.jpg', quote: 'Nos enfants ont adoré découvrir les bonobos à Lola ya Bonobo...', rating: 5 },
];

const OPTIONS: EmblaOptionsType = { loop: true, align: 'start' };

export function TestimonialsSection() {
    // --- Initialisation Simplifiée ---
    // On passe directement le plugin Autoplay au hook.
    // Plus de useEffect manuels, plus de refs pour le plugin.
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [
        Autoplay({
            delay: 5000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
        })
    ]);

    // Les fonctions de contrôle sont maintenant plus simples.
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="py-16 sm:py-24 bg-muted/20" data-aos="fade-up" data-aos-duration="1000">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 sm:mb-16">
                    <MessageSquareQuote className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                        Ils Ont Été Émerveillés
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                        Découvrez ce que nos visiteurs et partenaires pensent de leur expérience en RDC.
                    </p>
                </div>

                <div className="relative group">
                    <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                        <div className="flex -ml-4">
                            {testimonials.map((testimonial, index) => (
                                <div className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4" key={testimonial.id} data-aos="fade-up" data-aos-delay={100 + index * 100}>
                                    <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl h-full flex flex-col">
                                        {testimonial.rating !== undefined && (
                                            <div className="flex mb-3">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`h-5 w-5 ${i < testimonial.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                                ))}
                                            </div>
                                        )}
                                        <blockquote className="text-muted-foreground italic text-base sm:text-lg leading-relaxed flex-grow">
                                            “{testimonial.quote}”
                                        </blockquote>
                                        <div className="mt-6 flex items-center pt-4 border-t border-border/50">
                                            {testimonial.avatarUrl && (
                                                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                                                    {/* Correction de la syntaxe de next/image */}
                                                    <Image src={testimonial.avatarUrl} alt={testimonial.name} fill style={{ objectFit: 'cover' }} />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-foreground">{testimonial.name}</p>
                                                <p className="text-sm text-muted-foreground">{testimonial.roleOrLocation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {emblaApi && testimonials.length > 1 && (
                        <>
                            <button className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-3 z-10 p-2.5 bg-background/80 hover:bg-card text-foreground rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100" onClick={scrollPrev} aria-label="Précédent témoignage">
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-3 z-10 p-2.5 bg-background/80 hover:bg-card text-foreground rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100" onClick={scrollNext} aria-label="Prochain témoignage">
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}