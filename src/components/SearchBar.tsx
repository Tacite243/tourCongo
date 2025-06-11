"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Search, Users, MapPin, Home } from "lucide-react";
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    inHeaderCompactMode?: boolean;
}

export function SearchBar({ inHeaderCompactMode = false }: SearchBarProps) {
    const router = useRouter();
    // Ces états sont pour la barre de recherche principale (non compacte)
    const [destination, setDestination] = useState<string>("");
    const [checkInDate, setCheckInDate] = useState<Date | undefined>();
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
    const [guests, setGuests] = useState<string>("");

    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        if (destination) queryParams.set("destination", destination);
        if (checkInDate) queryParams.set("checkin", format(checkInDate, "yyyy-MM-dd"));
        if (checkOutDate) queryParams.set("checkout", format(checkOutDate, "yyyy-MM-dd"));
        if (guests) queryParams.set("guests", guests.toString());

        if (queryParams.toString()) {
            router.push(`/search?${queryParams.toString()}`);
        } else {
            // Peut-être ouvrir un modal plus détaillé ou focus le premier champ
            const mainInput = document.getElementById("main-search-bar-input");
            if (mainInput) mainInput.focus();
            // alert("Veuillez entrer des critères de recherche."); // Moins idéal pour UX
        }
    };

    if (inHeaderCompactMode) {
        return (
            <div className="flex items-center justify-between w-full max-w-md sm:max-w-xl rounded-full border shadow-md bg-background text-foreground px-2 py-1">
                {/* Destination */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center px-3 py-2 gap-1 truncate hover:bg-muted/30 rounded-full transition">
                            <Home size={16} className="text-muted-foreground" />
                            <span className="font-medium truncate">N’importe où</span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                        <label className="text-sm font-medium mb-1 block">Destination</label>
                        <Input
                            placeholder="Où allez-vous ?"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </PopoverContent>
                </Popover>

                <div className="w-px h-6 bg-border" />

                {/* Dates */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="px-3 py-2 truncate hover:bg-muted/30 rounded-full transition text-sm">
                            {checkInDate && checkOutDate
                                ? `${format(checkInDate, "dd MMM", { locale: fr })} - ${format(checkOutDate, "dd MMM", { locale: fr })}`
                                : "Dates flexibles"}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p className="text-sm font-medium mb-1">Date d’arrivée</p>
                                <Calendar
                                    mode="single"
                                    selected={checkInDate}
                                    onSelect={setCheckInDate}
                                    disabled={(date) =>
                                        date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                                        (checkOutDate ? date >= checkOutDate : false)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">Date de départ</p>
                                <Calendar
                                    mode="single"
                                    selected={checkOutDate}
                                    onSelect={setCheckOutDate}
                                    disabled={(date) =>
                                        checkInDate
                                            ? date <= checkInDate
                                            : date < new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                />
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="w-px h-6 bg-border" />

                {/* Voyageurs */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="px-3 py-2 truncate hover:bg-muted/30 rounded-full transition text-sm">
                            {guests ? `${guests} voyageurs` : "Ajouter des voyageurs"}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4">
                        <label htmlFor="guests" className="block text-sm font-medium mb-2">Nombre de voyageurs</label>
                        <Input
                            id="guests"
                            type="number"
                            min="1"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                        />
                    </PopoverContent>
                </Popover>

                {/* Bouton recherche */}
                <Button
                    size="icon"
                    className="bg-primary hover:bg-primary/90 text-white rounded-full ml-2"
                    onClick={handleSearch}
                >
                    <Search size={18} />
                </Button>
            </div>
        )
    }

    // Version complète (pour le corps de la page)
    return (
        <div className="w-full max-w-3xl mx-auto" id="main-search-bar-container">
            <div className="flex items-center bg-background border border-border rounded-full shadow-lg p-1.5 md:p-1 space-x-0.5 md:space-x-0">
                {/* Destination */}
                <div className="flex-1 group px-2.5 md:px-4 py-1.5 md:py-2 hover:bg-muted/30 rounded-full cursor-pointer transition-colors relative">
                    <label htmlFor="main-destination-input" className="block text-xs font-semibold text-foreground">
                        Destination
                    </label>
                    <Input
                        id="main-search-bar-input"
                        type="text"
                        placeholder="Rechercher une destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full h-auto p-0 text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground"
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors sm:hidden" />
                </div>
                <Separator orientation="vertical" className="h-8 md:h-10 hidden md:block" />

                {/* Arrivée */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className={cn("flex-1 md:w-auto justify-start text-left font-normal px-2.5 md:px-4 py-1.5 md:py-2 hover:bg-muted/30 rounded-full h-auto group", !checkInDate && "text-muted-foreground")}>
                            <div className="flex-1"><span className="block text-xs font-semibold text-foreground">Arrivée</span><span className="text-sm">{checkInDate ? format(checkInDate, "PPP", { locale: fr }) : "Quand ?"}</span></div>
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity hidden sm:block" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || (checkOutDate ? date >= checkOutDate : false)} /></PopoverContent>
                </Popover>
                <Separator orientation="vertical" className="h-8 md:h-10 hidden md:block" />

                {/* Départ */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className={cn("flex-1 md:w-auto justify-start text-left font-normal px-2.5 md:px-4 py-1.5 md:py-2 hover:bg-muted/30 rounded-full h-auto group", !checkOutDate && "text-muted-foreground")}>
                            <div className="flex-1"><span className="block text-xs font-semibold text-foreground">Départ</span><span className="text-sm">{checkOutDate ? format(checkOutDate, "PPP", { locale: fr }) : "Quand ?"}</span></div>
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity hidden sm:block" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} initialFocus disabled={(date) => (checkInDate ? date <= checkInDate : date < new Date(new Date().setHours(0, 0, 0, 0)))} /></PopoverContent>
                </Popover>
                <Separator orientation="vertical" className="h-8 md:h-10 hidden md:block" />

                {/* Voyageurs & Recherche combinés pour les petits écrans */}
                <div className="flex-1 group px-2.5 md:px-4 py-1.5 md:py-2 hover:bg-muted/30 rounded-full cursor-pointer transition-colors relative flex items-center justify-between">
                    <div className="flex-1">
                        <label htmlFor="guests" className="block text-xs font-semibold text-foreground">Voyageurs</label>
                        <Input id="guests" type="text" placeholder="Ajouter des..." value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full h-auto p-0 text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground" />
                    </div>
                    <Users className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block mr-2" />
                    <Button type="button" size="icon" onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-9 w-9 md:h-10 md:w-10 shrink-0" aria-label="Rechercher">
                        <Search className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}