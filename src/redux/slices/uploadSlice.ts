import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';
import imageCompression from 'browser-image-compression'; // Importer la bibliothèque



interface UploadState {
  isUploading: boolean;
  uploadedUrls: string[];
  error: string | null;
  // Optionnel: pour suivre la progression
  progress: number; 
}

const initialState: UploadState = {
  isUploading: false,
  uploadedUrls: [],
  error: null,
  progress: 0,
};

export const compressAndUploadFiles = createAsyncThunk<
  string[],
  File[],
  { rejectValue: string }
>(
  'upload/compressAndUpload',
  async (files, { rejectWithValue, dispatch }) => {
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      // --- ÉTAPE DE COMPRESSION ---
      console.log('Début de la compression des images...');
      const compressionOptions = {
        maxSizeMB: 1,          // Taille maximale de 1MB
        maxWidthOrHeight: 1920, // Redimensionne si l'image est plus grande
        useWebWorker: true,    // Utilise un worker pour ne pas bloquer l'UI
        onProgress: (p: number) => { /* Vous pourriez dispatcher une action de progression ici */ }
      };
      
      const compressionPromises = files.map(file => imageCompression(file, compressionOptions));
      const compressedFiles = await Promise.all(compressionPromises);
      console.log('Compression terminée. Début de l\'upload...');
      // --- FIN DE L'ÉTAPE DE COMPRESSION ---

      const uploadPromises = compressedFiles.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        // On augmente le timeout car même compressé, l'upload peut prendre du temps
        return axios.post(uploadUrl, formData, { timeout: 120000 }); // 2 minutes
      });

      const responses = await Promise.all(uploadPromises);
      const secureUrls = responses.map(response => response.data.secure_url);
      console.log('Upload terminé avec succès.');
      return secureUrls;

    } catch (error) {
      console.error("Erreur lors de la compression ou de l'upload :", error);
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
          return rejectWithValue("L'upload a pris trop de temps (timeout). Vérifiez votre connexion.");
      }
      return rejectWithValue("Un ou plusieurs uploads d'image ont échoué.");
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
      .addCase(compressAndUploadFiles.pending, (state) => {
        state.isUploading = true;
        state.error = null;
        state.uploadedUrls = [];
      })
      .addCase(compressAndUploadFiles.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.isUploading = false;
        state.uploadedUrls = action.payload;
      })
      .addCase(compressAndUploadFiles.rejected, (state, action) => {
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