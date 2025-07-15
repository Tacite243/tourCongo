
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { toast as sonnerToast } from 'sonner';

import { AppDispatch, RootState } from '@/redux/store';
import { uploadFiles, selectIsUploading, clearUploadedUrls } from '@/redux/slices/uploadSlice';
import { Button } from './ui/button';
import Image from 'next/image';
import { UploadCloud, X, LoaderCircle } from 'lucide-react';

interface ImageUploaderProps {
    onUploadSuccess: (urls: string[]) => void;
}

export function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
    const dispatch = useDispatch<AppDispatch>();
    const isUploading = useSelector((state: RootState) => state.upload.isUploading);
    const [localFiles, setLocalFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        if (fileRejections.length > 0) {
            fileRejections.forEach(({ errors }) => {
                errors.forEach((err: any) => sonnerToast.error(err.message));
            });
            return;
        }
        setLocalFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
        maxSize: 5 * 1024 * 1024,
    });

    const removeFile = (index: number) => {
        setLocalFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (localFiles.length === 0) return;

        // Dispatche l'action d'upload, qui est gérée par Redux
        dispatch(uploadFiles(localFiles))
            .unwrap() // .unwrap() retourne une promesse qui résout avec les URLs ou rejette avec l'erreur
            .then((uploadedUrls) => {
                sonnerToast.success(`${uploadedUrls.length} image(s) uploadée(s) !`);
                onUploadSuccess(uploadedUrls); // Informe le parent du succès
                setLocalFiles([]); // Vide les aperçus locaux
            })
            .catch((error) => {
                sonnerToast.error(error); // Affiche l'erreur retournée par rejectWithValue
            });
    };

    // Vider les URLs uploadées dans le state Redux lorsque le composant est démonté
    useEffect(() => {
        return () => {
            dispatch(clearUploadedUrls());
        }
    }, [dispatch]);

    return (
        <div className="space-y-4">
            <div {...getRootProps()} className={`flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                <input {...getInputProps()} />
                <div className="text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez ou cliquez ici</p>
                </div>
            </div>

            {localFiles.length > 0 && (
                <>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {localFiles.map((file, index) => (
                            <div key={index} className="relative aspect-square">
                                <Image src={URL.createObjectURL(file)} alt={`Aperçu ${index}`} fill className="object-cover rounded-md" />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => removeFile(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" onClick={handleUpload} disabled={isUploading} className="w-full">
                        {isUploading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        {isUploading ? "Téléchargement..." : `Uploader ${localFiles.length} image(s)`}
                    </Button>
                </>
            )}
        </div>
    );
}