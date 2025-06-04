import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';



export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Optionnel: pour logger les actions
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;