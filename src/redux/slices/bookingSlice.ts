import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Booking } from '@prisma/client';
import { CreateBookingInput } from '@/lib/utils/validation.schemas';
import axios from 'axios';

interface BookingState {
  // On pourrait stocker les réservations de l'utilisateur ici plus tard
  // myBookings: Booking[];
  isCreating: boolean;
  error: string | null;
}

const initialState: BookingState = {
  isCreating: false,
  error: null,
};

// Thunk pour créer une réservation
export const createBooking = createAsyncThunk<
  Booking,
  CreateBookingInput,
  { rejectValue: { message: string } }
>(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({ message: error.response?.data?.message || 'La réservation a échoué' });
      }
      return rejectWithValue({ message: 'Une erreur inconnue est survenue' });
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isCreating = false;
        // On pourrait ajouter la nouvelle réservation à une liste 'myBookings'
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || 'Erreur inconnue';
      });
  },
});

// Sélecteurs
export const selectIsBookingBeingCreated = (state: RootState) => state.bookings.isCreating;
export const selectBookingError = (state: RootState) => state.bookings.error;

export default bookingSlice.reducer;