import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Optionnel: pour logger les actions
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;