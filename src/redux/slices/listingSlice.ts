import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ListingSearchResult } from '@/lib/types'; // Notre nouveau type
import { SearchListingsParams } from '@/lib/services/listing.service'; // Le type des paramètres de recherche
import { CreateListingInput } from '@/lib/utils/validation.schemas';
import { Listing } from '@prisma/client';
import axios from 'axios';


// Définir l'état pour ce slice
interface ListingsState {
    listings: ListingSearchResult[];
    isLoading: boolean;
    error: string | null;
    isCreating: boolean;
    createError: string | null;
}


const initialState: ListingsState = {
    listings: [],
    isLoading: false,
    error: null,
    isCreating: false,
    createError: null,
};

export const createListing = createAsyncThunk<
    Listing, //type de retour
    CreateListingInput,
    { rejectValue: { message: string; errors?: any } }
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
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Une erreur réseau est survenue.');
        }
    }
);


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
            })
            .addCase(createListing.rejected, (state, action) => {
                state.isCreating = false;
                state.createError = action.payload?.message || 'Erreur inconnue';
            });
    },
});

export const { clearListings, clearCreateError } = listingSlice.actions;

// Sélecteurs pour accéder facilement à l'état depuis les composants
export const selectAllListings = (state: RootState) => state.listings.listings;
export const selectListingsLoading = (state: RootState) => state.listings.isLoading;
export const selectListingsError = (state: RootState) => state.listings.error;
export const selectIsCreatingListing = (state: RootState) => state.listings.isCreating;
export const selectCreateListingError = (state: RootState) => state.listings.createError;

export default listingSlice.reducer;