// src/components/ThemeProvider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentTheme, setTheme as setReduxTheme, Theme } from '@/redux/slices/themeSlice';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// ThemeSynchronizer: Met à jour Redux lorsque next-themes change.
export function ThemeSynchronizer() {
    const dispatch = useDispatch();
    const reduxTheme = useSelector(selectCurrentTheme);
    const { theme: nextThemeValue, resolvedTheme } = useNextTheme(); // theme est 'light', 'dark', ou 'system'

    React.useEffect(() => {
        // nextThemeValue est la valeur sélectionnée ('light', 'dark', 'system')
        // resolvedTheme est le thème réellement appliqué ('light' ou 'dark')
        const themeToSync = nextThemeValue as Theme | undefined; // 'light', 'dark', 'system'

        if (themeToSync && themeToSync !== reduxTheme) {
            console.log(`Syncing Redux: next-themes is ${themeToSync}, Redux was ${reduxTheme}`);
            dispatch(setReduxTheme(themeToSync));
        }
        // Si vous voulez que Redux reflète toujours le thème résolu (light/dark)
        // même si l'utilisateur a sélectionné "system" :
        // else if (resolvedTheme && resolvedTheme !== reduxTheme) {
        //   console.log(`Syncing Redux with resolved: next-themes resolved to ${resolvedTheme}, Redux was ${reduxTheme}`);
        //   dispatch(setReduxTheme(resolvedTheme as Theme));
        // }

    }, [nextThemeValue, resolvedTheme, reduxTheme, dispatch]);

    return null;
}