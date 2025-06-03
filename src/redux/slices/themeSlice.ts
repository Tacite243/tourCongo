// src/redux/slices/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  currentTheme: Theme;
}

// Essayer de récupérer le thème initial depuis localStorage si possible (pour l'hydratation côté client)
// Note: next-themes gère sa propre persistance localStorage, Redux va ici refléter/contrôler
// ce que next-themes devrait appliquer.

// const getInitialTheme = (): Theme => {
//   if (typeof window !== 'undefined') {
//     const storedTheme = localStorage.getItem('theme') as Theme; // next-themes utilise 'theme' par défaut
//     if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
//       return storedTheme;
//     }
//     // Si 'system', next-themes déterminera le thème actuel basé sur les préférences système
//     if (window.matchMedia('(prefers-color-scheme: dark)').matches && !storedTheme) {
//         return 'dark';
//     }
//   }
//   return 'system'; // Valeur par défaut, next-themes déterminera light/dark
// };


const initialState: ThemeState = {
  currentTheme: 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
      // La logique pour appliquer le thème (ex: classe sur <html> et localStorage)
      // sera gérée par le ThemeProvider de next-themes, déclenchée par ce changement d'état Redux.
    },
    // Vous pourriez ajouter toggleTheme si vous n'utilisez que light/dark
    // toggleTheme: (state) => {
    //   state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    // }
  },
});

export const { setTheme } = themeSlice.actions;

// Sélecteur pour obtenir le thème actuel
export const selectCurrentTheme = (state: RootState) => state.theme.currentTheme;

export default themeSlice.reducer;