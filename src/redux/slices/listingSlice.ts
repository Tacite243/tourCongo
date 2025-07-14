import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ListingSearchResult } from '@/lib/types'; // Notre nouveau type
import { SearchListingsParams } from '@/lib/services/listing.service'; // Le type des paramètres de recherche


// Définir l'état pour ce slice
interface ListingsState {
    listings: ListingSearchResult[];
    isLoading: boolean;
    error: string | null;
}


const initialState: ListingsState = {
    listings: [],
    isLoading: false,
    error: null,
};


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
            });
    },
});

export const { clearListings } = listingSlice.actions;

// Sélecteurs pour accéder facilement à l'état depuis les composants
export const selectAllListings = (state: RootState) => state.listings.listings;
export const selectListingsLoading = (state: RootState) => state.listings.isLoading;
export const selectListingsError = (state: RootState) => state.listings.error;

export default listingSlice.reducer;