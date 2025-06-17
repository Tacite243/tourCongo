"use client";

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function AOSInitializer({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        AOS.init({
            duration: 800, // Durée des animations en ms
            once: false, // Si l'animation doit se produire une seule fois ou à chaque scroll
            offset: 50, // Décalage (en px) par rapport au point de déclenchement d'origine
            // easing: 'ease-in-out', // Type d'easing
        });
    }, []);

    return <>{children}</>;
}