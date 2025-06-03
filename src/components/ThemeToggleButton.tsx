// src/components/ThemeToggleButton.tsx
"use client";

import React, { useState, useEffect } from 'react'; // Importer useState et useEffect
import { useTheme as useNextTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false); // État pour suivre le montage

  // useEffect se lance uniquement côté client, après le montage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Si le composant n'est pas encore monté (côté serveur ou avant l'hydratation client),
  // ne rien rendre ou rendre un placeholder pour éviter le mismatch.
  // Rendre un bouton vide mais de même taille peut éviter les sauts de layout (CLS).
  if (!mounted) {
    return (
        <Button variant="outline" size="icon" disabled>
            <Sun className="h-[1.2rem] w-[1.2rem]" /> {/* Ou une icône générique/vide */}
        </Button>
    );
    // Ou simplement `return null;` si vous préférez ne rien afficher avant l'hydratation
  }

  const currentAppliedTheme = resolvedTheme || theme; // resolvedTheme peut être undefined au début

  const toggle = () => {
    setTheme(currentAppliedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button variant="outline" size="icon" onClick={toggle}>
      {currentAppliedTheme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}