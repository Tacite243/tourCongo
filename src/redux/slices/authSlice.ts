import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { UserAuthInfo } from '@/lib/types';
import { z } from 'zod';
import { loginSchema, registerSchema } from '@/lib/utils/validation.schemas';
import axios, { AxiosError } from 'axios';

type LoginCredentials = z.infer<typeof loginSchema>;
type RegisterCredentials = z.infer<typeof registerSchema>;

interface AuthState {
  user: UserAuthInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthInitialized: boolean;
  error: string | null | undefined;
  registrationSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isAuthInitialized: false,
  error: null,
  registrationSuccess: false,
};

// --- Login ---
export const loginUser = createAsyncThunk<
  UserAuthInfo,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data.user as UserAuthInfo;
    } catch (error) { // error est 'unknown'
      if (axios.isAxiosError(error)) { // Vérifier si c'est une AxiosError
        const axiosError = error as AxiosError<{ message?: string }>; // Typer l'erreur
        const message = axiosError.response?.data?.message || axiosError.message || 'Échec de la connexion';
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue((error as Error).message || 'Une erreur inconnue est survenue');
    }
  }
);

// --- Register ---
export const registerUser = createAsyncThunk<
  UserAuthInfo,
  RegisterCredentials,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/register', credentials);
      return response.data.user as UserAuthInfo;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Échec de l\'inscription';
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue((error as Error).message || 'Une erreur inconnue est survenue');
    }
  }
);

// --- Fetch current user ---
export const fetchCurrentUser = createAsyncThunk<
  UserAuthInfo,
  void,
  { rejectValue: string }
>(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/auth/me');
      return response.data.user as UserAuthInfo;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Non autorisé';
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue((error as Error).message || 'Une erreur inconnue est survenue');
    }
  }
);

// --- Logout ---
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await axios.post('/api/auth/logout');
      return;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Échec de la déconnexion';
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue((error as Error).message || 'Une erreur inconnue est survenue');
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
      state.registrationSuccess = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    resetRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload ?? 'Erreur inconnue';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationSuccess = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserAuthInfo>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthInitialized = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthInitialized = true;
      })
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

export const { setCurrentUser, clearAuthError, resetRegistrationSuccess } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectRegistrationSuccess = (state: RootState) => state.auth.registrationSuccess;
export const selectIsAuthInitialized = (state: RootState) => state.auth.isAuthInitialized;

export default authSlice.reducer;
