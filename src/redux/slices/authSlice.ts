import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { UserAuthInfo } from '@/lib/types'; // Ajustez le chemin si nécessaire
import { z } from 'zod';
import { loginSchema, registerSchema } from '@/lib/utils/validation.schemas'; // Ajustez

// Définir les types pour les données que les thunks attendront
type LoginCredentials = z.infer<typeof loginSchema>;
type RegisterCredentials = z.infer<typeof registerSchema>; // Nouveau type

interface AuthState {
  user: UserAuthInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null | undefined;
  // Optionnel: pour indiquer un succès d'inscription si vous voulez afficher un message spécifique
  registrationSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationSuccess: false, // Initialiser à false
};

// --- Thunk pour la connexion (loginUser) - Inchangé ---
export const loginUser = createAsyncThunk<
  UserAuthInfo,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) return thunkAPI.rejectWithValue(data.message || 'Échec de la connexion');
      return data.user as UserAuthInfo;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Une erreur réseau est survenue');
    }
  }
);

// --- Thunk pour l'inscription (registerUser) - NOUVEAU ---
export const registerUser = createAsyncThunk<
  UserAuthInfo, // Ce que le backend retourne pour /api/auth/register (l'utilisateur sans le mot de passe)
  RegisterCredentials,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // data.message devrait contenir l'erreur du backend (ex: email déjà utilisé, validation)
        return thunkAPI.rejectWithValue(data.message || 'Échec de l\'inscription');
      }
      // data.user contient l'utilisateur nouvellement créé
      // Note: Après l'inscription, l'utilisateur n'est généralement PAS automatiquement connecté
      // (pas de cookie de session créé par l'API register).
      // Il devra se connecter séparément. Si vous voulez le connecter automatiquement,
      // votre API /register devrait aussi créer une session et un token.
      return data.user as UserAuthInfo;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Une erreur réseau est survenue lors de l\'inscription');
    }
  }
);


// --- Thunk pour récupérer l'utilisateur actuel (fetchCurrentUser) - Inchangé ---
export const fetchCurrentUser = createAsyncThunk<
  UserAuthInfo,
  void,
  { rejectValue: string }
>(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) return thunkAPI.rejectWithValue(data.message || 'Non autorisé');
      return data.user as UserAuthInfo;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Erreur réseau');
    }
  }
);

// --- Thunk pour la déconnexion (logoutUser) - Inchangé ---
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data.message || 'Échec de la déconnexion');
      }
      return;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Erreur réseau');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserAuthInfo | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
      state.registrationSuccess = false; // Réinitialiser si on définit l'utilisateur manuellement
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    resetRegistrationSuccess: (state) => { // NOUVELLE ACTION pour réinitialiser le flag
        state.registrationSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login (inchangé)
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserAuthInfo>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Register - NOUVEAU
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserAuthInfo>) => {
        state.isLoading = false;
        // L'utilisateur est enregistré mais PAS connecté automatiquement par ce thunk.
        // state.user = action.payload; // Ne pas définir l'utilisateur ici
        // state.isAuthenticated = true; // Ne pas mettre à true
        state.registrationSuccess = true; // Indiquer que l'inscription a réussi
        state.error = null;
        // L'utilisateur devra se connecter avec ses nouveaux identifiants.
        // Le payload (action.payload) contient les infos de l'utilisateur créé,
        // vous pourriez les utiliser pour pré-remplir un formulaire de connexion ou afficher un message.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Afficher l'erreur d'inscription
        state.registrationSuccess = false;
      })

      // Fetch Current User (inchangé)
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserAuthInfo>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout (inchangé)
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Exporter la nouvelle action synchrone
export const { setCurrentUser, clearAuthError, resetRegistrationSuccess } = authSlice.actions;

// Sélecteurs
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectRegistrationSuccess = (state: RootState) => state.auth.registrationSuccess; // NOUVEAU

export default authSlice.reducer;