import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface UploadState {
  isUploading: boolean;
  uploadedUrls: string[];
  error: string | null;
}

const initialState: UploadState = {
  isUploading: false,
  uploadedUrls: [],
  error: null,
};

// Thunk pour uploader une liste de fichiers
export const uploadFiles = createAsyncThunk<
  string[], // Retourne un tableau d'URLs en cas de succès
  File[],   // Prend un tableau de fichiers en argument
  { rejectValue: string }
>(
  'upload/uploadFiles',
  async (files, thunkAPI) => {
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const uploadPromises = files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      // Utiliser axios pour plus de consistance avec les autres thunks
      return axios.post(uploadUrl, formData);
    });

    try {
      const responses = await Promise.all(uploadPromises);
      const secureUrls = responses.map(response => response.data.secure_url);
      return secureUrls;
    } catch (error) {
      console.error("Erreur lors de l'upload vers Cloudinary:", error);
      return thunkAPI.rejectWithValue("Un ou plusieurs uploads d'image ont échoué.");
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearUploadedUrls: (state) => {
      state.uploadedUrls = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.isUploading = true;
        state.error = null;
        state.uploadedUrls = [];
      })
      .addCase(uploadFiles.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.isUploading = false;
        state.uploadedUrls = action.payload;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUploadedUrls } = uploadSlice.actions;

// Sélecteurs
export const selectIsUploading = (state: RootState) => state.upload.isUploading;
export const selectUploadedUrls = (state: RootState) => state.upload.uploadedUrls;
export const selectUploadError = (state: RootState) => state.upload.error;

export default uploadSlice.reducer;