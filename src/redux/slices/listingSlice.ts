import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ListingSearchResult } from '@/lib/types';
import { SearchListingsParams } from '@/lib/services/listing.service'; // Le type des paramètres de recherche
import { CreateListingInput } from '@/lib/utils/validation.schemas';
import { Listing, Photo } from '@prisma/client';
import axios from 'axios';



// Définir l'état pour ce slice
interface ListingsState {
    listings: ListingSearchResult[]; // Pour les résultats de recherche
    hostListings: HostListingResult[]; // Pour les annonces de l'hôte
    recentListings: ListingSearchResult[]; // Champ pour la page d'accueil
    isLoading: boolean;
    isRecentLoading: boolean; // Etat de chargement spécifique pour les récents
    error: string | null;
    isCreating: boolean;
    createError: string | null;
}

// Le type retourné par notre nouveau service
export type HostListingResult = Listing & {
    photos: Photo[];
    _count: {
        bookings: number;
        reviews: number;
        likes: number;
    }
}

const initialState: ListingsState = {
    listings: [],
    hostListings: [],
    recentListings: [],
    isLoading: false,
    isRecentLoading: true, // Commence à true pour afficher les skeletons au premier chargement
    error: null,
    isCreating: false,
    createError: null,
};

export const createListing = createAsyncThunk<
    Listing, //type de retour
    CreateListingInput,
    { rejectValue: { message: string; errors?: unknown } }
>(
    'listings/create',
    async (listingData, thunkAPI) => {
        try {
            const response = await axios.post('/api/listings', listingData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue({
                    message: error.response?.data.message || 'Échec de la création',
                    errors: error.response?.data.errors,
                });
            }
            return thunkAPI.rejectWithValue({ message: 'Une erreur inconnue est survenue' });
        }
    }
);

// Thunk asynchrone pour rechercher les logements
export const searchListings = createAsyncThunk<
    ListingSearchResult[],      // Type de retour en cas de succès
    SearchListingsParams,       // Type de l'argument (destination, dates, etc.)
    { rejectValue: string }     // Type de la valeur d'erreur
>(
    'listings/search',
    async (searchParams, thunkAPI) => {
        // Construire la query string à partir des paramètres
        const params = new URLSearchParams();
        if (searchParams.destination) params.append('destination', searchParams.destination);
        if (searchParams.startDate) params.append('startDate', searchParams.startDate.toISOString());
        if (searchParams.endDate) params.append('endDate', searchParams.endDate.toISOString());
        if (searchParams.guests) params.append('guests', searchParams.guests.toString());

        try {
            const response = await fetch(`/api/listings?${params.toString()}`);

            if (!response.ok) {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || 'La recherche a échoué.');
            }

            const data: ListingSearchResult[] = await response.json();
            return data;
        } catch (error) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue(error.message);
            }
            return thunkAPI.rejectWithValue('Une erreur réseau est survenue.');
        }
    }
);

export const fetchHostListings = createAsyncThunk<
    HostListingResult[],
    void, // Pas d'argument nécessaire, l'ID vient de la session
    { rejectValue: string }
>(
    'listings/fetchHostListings',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/host/listings');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data.message || 'Échec de la récupération des annonces');
            }
            return thunkAPI.rejectWithValue('Une erreur inconnue est survenue');
        }
    }
);

export const fetchRecentListings = createAsyncThunk<
    ListingSearchResult[],
    void, // Pas d'argument nécessaire
    { rejectValue: string }
>(
    'listings/fetchRecent',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/listings/recent');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue('Une erreur inconnue est survenue');
            };
        }
    }
)

const listingSlice = createSlice({
    name: 'listings',
    initialState,
    reducers: {
        // Action synchrone si vous avez besoin de vider les résultats manuellement
        clearListings: (state) => {

            state.listings = [];
            state.error = null;
        },
        clearCreateError: (state) => {
            state.createError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchListings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchListings.fulfilled, (state, action: PayloadAction<ListingSearchResult[]>) => {
                state.isLoading = false;
                state.listings = action.payload;
            })
            .addCase(searchListings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.listings = []; // Vider les résultats en cas d'erreur
            })
            .addCase(createListing.pending, (state) => {
                state.isCreating = true;
                state.createError = null;
            })
            .addCase(createListing.fulfilled, (state, action) => {
                state.isCreating = false;
                // Optionnel : ajouter le nouveau logement à la liste existante si pertinent
                // state.listings.unshift(action.payload);
                // Ajoute la nouvelle annonce au début de la liste du dashboard de l'hôte
                state.hostListings.unshift(action.payload as HostListingResult);
            })
            .addCase(createListing.rejected, (state, action) => {
                state.isCreating = false;
                state.createError = action.payload?.message || 'Erreur inconnue';
            })
            .addCase(fetchHostListings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHostListings.fulfilled, (state, action: PayloadAction<HostListingResult[]>) => {
                state.isLoading = false;
                state.hostListings = action.payload;
            })
            .addCase(fetchHostListings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchRecentListings.pending, (state) => {
                state.isRecentLoading = true;
            })
            .addCase(fetchRecentListings.fulfilled, (state, action: PayloadAction<ListingSearchResult[]>) => {
                state.isRecentLoading = false;
                state.recentListings = action.payload;
            })
            .addCase(fetchRecentListings.rejected, (state, action) => {
                state.isRecentLoading = false;
                state.error = action.payload as string;
            })
    },
});

export const { clearListings, clearCreateError } = listingSlice.actions;

// Sélecteurs pour accéder facilement à l'état depuis les composants
export const selectAllListings = (state: RootState) => state.listings.listings;
export const selectListingsLoading = (state: RootState) => state.listings.isLoading;
export const selectListingsError = (state: RootState) => state.listings.error;
export const selectIsCreatingListing = (state: RootState) => state.listings.isCreating;
export const selectCreateListingError = (state: RootState) => state.listings.createError;
export const selectHostings = (state: RootState) => state.listings.hostListings;
export const selectRecentListings = (state: RootState) => state.listings.recentListings;
export const selectIsRecentLoading = (state: RootState) => state.listings.isRecentLoading;


export default listingSlice.reducer;
