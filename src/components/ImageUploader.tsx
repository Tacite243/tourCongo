// src/components/ImageUploader.tsx
"use client";
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ImageUploaderProps {
    onUpload: (urls: string[]) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);

    const uploadImages = async (files: FileList | null) => {
        if (!files) return;
        setIsUploading(true);
        const uploadedUrls: string[] = [];

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (data.secure_url) {
                    uploadedUrls.push(data.secure_url);
                }
            } catch (error) {
                console.error("Erreur d'upload:", error);
            }
        }
        onUpload(uploadedUrls);
        setIsUploading(false);
    };

    return (
        <div>
            <Input type="file" multiple onChange={(e) => uploadImages(e.target.files)} disabled={isUploading} />
            {isUploading && <p>Téléchargement en cours...</p>}
        </div>
    );
};