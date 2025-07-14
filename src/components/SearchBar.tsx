// src/components/SearchBar.tsx

"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format, formatISO, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, Search, Users, MapPin, Minus, Plus } from "lucide-react";

interface SearchBarProps {
    // Prop pour déterminer si la barre est en mode compact (dans le header)
    // ou en mode complet (sur la page d'accueil ou de résultats).
    inHeaderCompactMode?: boolean;
}

export function SearchBar({ inHeaderCompactMode = false }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams(); // Hook pour lire les paramètres de l'URL actuelle

    // --- ÉTATS UNIFIÉS ---
    // Les états sont initialisés à partir des paramètres de l'URL.
    // Cela permet à la barre de recherche de "se souvenir" de la dernière recherche
    // lorsque l'utilisateur navigue ou recharge la page.

    const [destination, setDestination] = useState<string>(searchParams.get('destination') || "");

    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        if (startDate && endDate) {
            try {
                // Tente de parser les dates depuis l'URL. Si le format est invalide, retourne undefined.
                return { from: parseISO(startDate), to: parseISO(endDate) };
            } catch (error) {
                console.error("Format de date invalide dans l'URL:", error);
                return undefined;
            }
        }
        return undefined;
    });

    const [guests, setGuests] = useState<number>(() => {
        const g = parseInt(searchParams.get('guests') || '1', 10);
        return isNaN(g) || g < 1 ? 1 : g; // Assure que le nombre est au moins 1
    });

    // --- LOGIQUE DE RECHERCHE ---
    // Le rôle de cette fonction est de construire une nouvelle URL avec les critères de recherche
    // et de rediriger l'utilisateur vers la page des résultats.
    const handleSearch = () => {
        const params = new URLSearchParams();

        if (destination.trim()) {
            params.append('destination', destination.trim());
        }
        if (dateRange?.from) {
            // formatISO avec { representation: 'date' } donne "YYYY-MM-DD"
            params.append('startDate', formatISO(dateRange.from, { representation: 'date' }));
        }
        if (dateRange?.to) {
            params.append('endDate', formatISO(dateRange.to, { representation: 'date' }));
        }
        if (guests > 0) {
            params.append('guests', guests.toString());
        }

        // Redirige vers la page `/listings` avec les nouveaux paramètres.
        // C'est cette page qui déclenchera l'action Redux pour charger les données.
        router.push(`/listings?${params.toString()}`);
    };

    // --- COMPOSANT INTERNE POUR LE SÉLECTEUR DE VOYAGEURS (UX AMÉLIORÉE) ---
    const GuestsSelector = () => (
        <div className="w-64 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium">Voyageurs</p>
                    <p className="text-sm text-muted-foreground">Adultes</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setGuests(prev => Math.max(1, prev - 1))} disabled={guests <= 1}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center font-semibold">{guests}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setGuests(prev => prev + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {/* Vous pourriez ajouter d'autres catégories ici : enfants, bébés, etc. */}
        </div>
    );

    // --- MODE COMPACT (POUR LE HEADER) ---
    // Ce mode agit comme un simple bouton qui déclenche la recherche avec les valeurs actuelles.
    if (inHeaderCompactMode) {
        return (
            <Button
                variant="outline"
                onClick={handleSearch}
                className="w-full max-w-sm md:max-w-md h-12 rounded-full shadow-md flex justify-between items-center px-4"
            >
                <span className="font-semibold truncate">{destination || "Rechercher une destination"}</span>
                <div className="bg-primary text-primary-foreground p-2 rounded-full">
                    <Search size={16} />
                </div>
            </Button>
        );
    }

    // --- MODE COMPLET (POUR LA PAGE D'ACCUEIL / RÉSULTATS) ---
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center bg-background border border-border rounded-full shadow-lg p-1.5 space-y-2 md:space-y-0 md:space-x-0">
                {/* Section Destination */}
                <div className="w-full md:flex-1 group px-4 py-2 hover:bg-muted/30 rounded-full cursor-text transition-colors relative">
                    <label htmlFor="destination-input" className="block text-xs font-semibold text-foreground">Destination</label>
                    <Input id="destination-input" placeholder="Rechercher une destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full h-auto p-0 text-sm border-none focus-visible:ring-0 bg-transparent" />
                </div>
                <Separator orientation="vertical" className="h-10 hidden md:block" />

                {/* Section Calendrier Unifié */}
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="w-full md:flex-auto flex hover:bg-muted/30 rounded-full cursor-pointer transition-colors">
                            <Button variant="ghost" className="flex-1 text-left font-normal px-4 py-2 h-auto">
                                <div><span className="block text-xs font-semibold">Arrivée</span><span className="text-sm text-muted-foreground">{dateRange?.from ? format(dateRange.from, "d MMM yyyy", { locale: fr }) : "Quand ?"}</span></div>
                            </Button>
                            <Separator orientation="vertical" className="h-10" />
                            <Button variant="ghost" className="flex-1 text-left font-normal px-4 py-2 h-auto">
                                <div><span className="block text-xs font-semibold">Départ</span><span className="text-sm text-muted-foreground">{dateRange?.to ? format(dateRange.to, "d MMM yyyy", { locale: fr }) : "Quand ?"}</span></div>
                            </Button>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} locale={fr} disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }} />
                    </PopoverContent>
                </Popover>
                <Separator orientation="vertical" className="h-10 hidden md:block" />

                {/* Section Voyageurs & Bouton Recherche */}
                <div className="w-full md:flex-auto flex items-center justify-between group pl-4 pr-1.5 py-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="flex-1 cursor-pointer hover:bg-muted/30 rounded-full p-2 -m-2">
                                <p className="block text-xs font-semibold text-foreground">Voyageurs</p>
                                <p className="text-sm text-muted-foreground">{guests > 0 ? (guests > 1 ? `${guests} voyageurs` : "1 voyageur") : "Ajouter"}</p>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><GuestsSelector /></PopoverContent>
                    </Popover>
                    <Button type="button" size="lg" onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 w-auto px-4 md:px-6 shrink-0 flex items-center gap-2 ml-2">
                        <Search className="h-5 w-5" />
                        <span className="font-bold hidden sm:inline">Rechercher</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}