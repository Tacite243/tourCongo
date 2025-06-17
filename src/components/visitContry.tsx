"use client";

import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function VisitCountrySection() {
    return (
        <section className="flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-background text-foreground">
            <div className="text-center space-y-2">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                    Découvrez la RDC
                </h1>
                <Separator className="mx-auto w-12 bg-primary h-1 rounded" />
            </div>

            <div className="mt-8 space-y-6 max-w-2xl text-lg text-center">
                <p>
                    La République Démocratique du Congo vous ouvre ses portes.{" "}
                    <span className="text-primary font-semibold hover:underline cursor-pointer">
                        Cliquez ici
                    </span>{" "}
                    pour explorer ses trésors.
                </p>
                <p>
                    Du majestueux fleuve Congo aux volcans du Kivu, en passant par les parcs nationaux
                    comme ceux de la Garamba ou de la Salonga, la RDC regorge de merveilles naturelles
                    uniques au monde. Une expérience authentique au cœur de l’Afrique.
                </p>
            </div>

            {/* ACCORDÉON ÉTENDU */}
            <div className="mt-8 w-full">
                <Accordion type="single" collapsible>
                    <AccordionItem value="more">
                        <AccordionTrigger className="group text-lg font-medium py-3 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-all max-w-2xl mx-auto">
                            <div className="flex items-center justify-between w-full">
                                <span>Voir plus sur les opportunités et le tourisme</span>
                                <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="relative mt-4 overflow-hidden w-screen px-4 sm:px-6 lg:px-8">
                            {/* Arrière-plan full screen avec image floutée légère */}
                            <div className="absolute inset-0 z-[-1]">
                                <Image
                                    src="/anapi.jpeg"
                                    alt="RDC paysage"
                                    fill
                                    className="object-cover blur-[2px] opacity-20"
                                    priority
                                />
                                {/* Overlay adaptatif thème clair/sombre */}
                                <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>
                            </div>

                            <div className="relative max-w-4xl mx-auto px-6 py-10 space-y-6 rounded-xl bg-background/80 shadow-lg border border-muted backdrop-blur-xl">
                                <div className="space-y-4 text-base text-muted-foreground">
                                    <p>
                                        Vous êtes investisseur ? Découvrez les nombreuses opportunités économiques
                                        dans le tourisme, l’agriculture, les mines et bien plus.{" "}
                                        <span className="font-semibold text-primary hover:underline cursor-pointer">
                                            Voir les avantages fiscaux
                                        </span>.
                                    </p>

                                    <p>
                                        Consultez{" "}
                                        <span className="font-semibold text-primary hover:underline cursor-pointer">
                                            nos offres exclusives
                                        </span>{" "}
                                        pour les circuits touristiques et les projets d’investissement.
                                    </p>
                                </div>

                                <div className="rounded-xl border p-4 bg-muted/30 shadow-sm text-left">
                                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                                        Pourquoi choisir la RDC ?
                                    </h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        <li>Richesse naturelle exceptionnelle et biodiversité rare</li>
                                        <li>Population jeune, accueillante et multilingue</li>
                                        <li>Potentiel touristique inexploité à fort rendement</li>
                                        <li>Incitations fiscales pour les investisseurs étrangers</li>
                                    </ul>
                                </div>

                                <div className="pt-4 text-center">
                                    <button className="px-6 py-3 bg-primary text-white font-medium rounded-full shadow hover:bg-primary/90 transition-all">
                                        Planifier votre séjour
                                    </button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}
