"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast as sonnerToast } from 'sonner';
import { UploadCloud, X, LoaderCircle } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

interface ImageUploaderProps {
    onUploadSuccess: (urls: string[]) => void;
    // Optionnel: pour informer le composant parent de l'état de chargement
    onUploadingChange?: (isUploading: boolean) => void;
}

export function ImageUploader({ onUploadSuccess, onUploadingChange }: ImageUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        if (fileRejections.length > 0) {
            fileRejections.forEach(({ errors }) => {
                errors.forEach((err: any) => sonnerToast.error(err.message));
            });
            return;
        }
        // Créer des URLs d'aperçu pour les fichiers acceptés
        const newFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
        maxSize: 5 * 1024 * 1024, // 5MB
        maxFiles: 5, // Limiter à 5 images à la fois par exemple
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            sonnerToast.info("Veuillez sélectionner au moins une image.");
            return;
        }

        setIsUploading(true);
        onUploadingChange?.(true);
        const uploadedUrls: string[] = [];
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (data.secure_url) {
                    uploadedUrls.push(data.secure_url);
                } else {
                    throw new Error('Upload vers Cloudinary a échoué.');
                }
            } catch (error) {
                console.error("Erreur d'upload:", error);
                sonnerToast.error(`L'upload de ${file.name} a échoué.`);
                setIsUploading(false);
                onUploadingChange?.(false);
                return; // Arrêter le processus si un upload échoue
            }
        }

        sonnerToast.success(`${uploadedUrls.length} image(s) uploadée(s) avec succès !`);
        onUploadSuccess(uploadedUrls); // Envoyer les URLs au formulaire parent
        setFiles([]); // Vider les fichiers après l'upload
        setIsUploading(false);
        onUploadingChange?.(false);
    };

    return (
        <div className="space-y-4">
            {/* Zone de Drop */}
            <div {...getRootProps()} className={`flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                <input {...getInputProps()} />
                <div className="text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez ou cliquez ici</p>
                    <p className="text-xs text-muted-foreground/80">Max 5 images, 5MB par image</p>
                </div>
            </div>

            {/* Aperçus des images */}
            {files.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative aspect-square">
                            <Image src={(file as any).preview} alt={`Aperçu ${index}`} fill className="object-cover rounded-md" />
                            <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => removeFile(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Bouton d'upload */}
            {files.length > 0 && (
                <Button type="button" onClick={handleUpload} disabled={isUploading} className="w-full">
                    {isUploading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    {isUploading ? "Téléchargement..." : `Uploader ${files.length} image(s)`}
                </Button>
            )}
        </div>
    );
};