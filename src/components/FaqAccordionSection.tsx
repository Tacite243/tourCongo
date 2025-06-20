// src/components/FaqAccordionSection.tsx
"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqItems = [
    {
        value: "item-1",
        question: "Ai-je besoin d'un visa pour visiter la RDC ?",
        answer: "Oui, la plupart des nationalités ont besoin d'un visa pour entrer en RDC. Nous vous recommandons de consulter l'ambassade ou le consulat de la RDC dans votre pays de résidence pour les informations les plus récentes et pour entamer la procédure de demande bien avant votre voyage."
    },
    {
        value: "item-2",
        question: "Quelle est la meilleure période pour visiter la RDC ?",
        answer: "La RDC a un climat équatorial. La saison sèche, généralement de mai à septembre, est souvent considérée comme la meilleure période pour le tourisme, en particulier pour les safaris et le trekking. Cependant, le pays peut être visité toute l'année, chaque saison offrant ses propres charmes."
    },
    {
        value: "item-3",
        question: "La RDC est-elle une destination sûre pour les touristes ?",
        answer: "Comme pour de nombreuses destinations, la sécurité peut varier selon les régions. Il est conseillé de bien se renseigner, de voyager avec des opérateurs touristiques réputés et de suivre les conseils aux voyageurs de votre gouvernement. De nombreuses zones touristiques sont sécurisées et accueillantes."
    },
    {
        value: "item-4",
        question: "Quelles vaccinations sont recommandées ou obligatoires ?",
        answer: "La vaccination contre la fièvre jaune est généralement obligatoire. D'autres vaccinations comme l'hépatite A et B, la typhoïde, et la prise d'un traitement antipaludique sont fortement recommandées. Consultez votre médecin ou un centre de vaccination international plusieurs mois avant votre départ."
    },
    // Ajoutez plus de FAQ
];

export function FaqAccordionSection() {
    return (
        <section className="py-16 sm:py-24 bg-background" data-aos="fade-up" data-aos-duration="900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 sm:mb-16">
                    <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                        Questions Fréquentes
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                        Trouvez les réponses aux interrogations courantes pour préparer au mieux votre voyage en RDC.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {faqItems.map((item, index) => (
                            <AccordionItem
                                value={item.value}
                                key={item.value}
                                className="border border-border/70 rounded-lg shadow-sm bg-card overflow-hidden"
                                data-aos="fade-up"
                                data-aos-delay={100 + index * 50}
                            >
                                <AccordionTrigger className="text-left font-semibold text-base sm:text-lg px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 text-muted-foreground text-sm sm:text-base leading-relaxed">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}