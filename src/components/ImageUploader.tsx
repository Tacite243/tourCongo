"use client";

import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast as sonnerToast } from 'sonner';
import { Button } from './ui/button';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';

// Type pour un fichier incluant son URL d'aperçu temporaire
type FileWithPreview = File & { preview: string };

interface ImageUploaderProps {
    onFilesChange: (files: File[]) => void;
    initialFiles?: File[];
}

export function ImageUploader({ onFilesChange, initialFiles = [] }: ImageUploaderProps) {
    const [localFiles, setLocalFiles] = React.useState<FileWithPreview[]>(
        initialFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))
    );

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        console.log('[ImageUploader] onDrop a été appelé !');
        if (fileRejections.length > 0) {
            fileRejections.forEach(({ errors }) => {
                errors.forEach((err: any) => sonnerToast.error(err.message));
            });
            return;
        };
        console.log('[ImageUploader] Fichiers acceptés:', acceptedFiles);

        const newFilesWithPreview = acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
        const updatedFiles = [...localFiles, ...newFilesWithPreview];
        setLocalFiles(updatedFiles);
        
        console.log('[ImageUploader] Appel de onFilesChange avec', updatedFiles.length, 'fichiers.');
        onFilesChange(updatedFiles);

    }, [localFiles, onFilesChange]);

    // isDragActive pour le style, isPending pour le feedback de chargement
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
        maxSize: 5 * 1024 * 1024,
    });

    const removeFile = (indexToRemove: number) => {
        const updatedFiles = localFiles.filter((_, index) => index !== indexToRemove);
        setLocalFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    useEffect(() => {
        return () => localFiles.forEach(file => URL.revokeObjectURL(file.preview));
    }, [localFiles]);

    return (
        <div className="space-y-4">
            <div {...getRootProps()} className={`flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${isDragActive ? 'border-primary' : 'border-border'} ${isDragReject ? 'border-destructive bg-destructive/10' : ''} ${isDragAccept ? 'border-primary bg-primary/10' : ''}`}>
                <input {...getInputProps()} />
                <div className="text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez ou cliquez ici</p>
                    <p className="text-xs text-muted-foreground/80">PNG, JPG, WEBP jusqu'à 5MB</p>
                </div>
            </div>

            {localFiles.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {localFiles.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="relative aspect-square">
                            <Image src={file.preview} alt={`Aperçu ${file.name}`} fill className="object-cover rounded-md" />
                            <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-lg" onClick={(e) => { e.stopPropagation(); removeFile(index); }}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};