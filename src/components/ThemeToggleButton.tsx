"use client";

import React, { useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import clsx from "clsx";

export function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        disabled
        className="h-9 w-9 rounded-xl bg-muted text-muted-foreground opacity-70"
      >
        <Sun className="h-4 w-4 mx-auto" />
      </button>
    );
  }

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={clsx(
        "transition-colors duration-300 ease-in-out",
        "h-9 w-9 rounded-xl",
        "flex items-center justify-center",
        isDark
          ? "bg-muted hover:bg-muted/80 text-white shadow-inner"
          : "bg-secondary hover:bg-secondary/80 text-foreground shadow-sm"
      )}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
