import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import listingReducer from './slices/listingSlice';
import uploadReducer from './slices/uploadSlice';


export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    listings: listingReducer,
    upload: uploadReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Optionnel: pour logger les actions
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;