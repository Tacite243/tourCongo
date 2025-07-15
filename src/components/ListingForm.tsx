"use client";

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { toast as sonnerToast } from "sonner";

import { createListingSchema, CreateListingInput } from '@/lib/utils/validation.schemas';
import { AppDispatch } from '@/redux/store';
import { createListing, selectIsCreatingListing } from '@/redux/slices/listingSlice';
import { ListingType } from '@prisma/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, X } from 'lucide-react';

const amenitiesList = ["Wifi", "Télévision", "Cuisine", "Climatisation", "Piscine", "Parking gratuit", "Salle de sport", "Jacuzzi"];

// Le onSuccess sera utilisé pour fermer le popup/modal qui contient ce formulaire
export function ListingForm({ onSuccess }: { onSuccess: () => void }) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const isCreating = useSelector(selectIsCreatingListing);
    const [imageFiles, setImageFiles] = useState<File[]>([]); // Stocker les fichiers d'image
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<CreateListingInput>({
        resolver: zodResolver(createListingSchema),
        defaultValues: {
            title: "",
            description: "",
            type: ListingType.APPARTEMENT, // Valeur par défaut
            price: 50,
            address: "",
            city: "",
            country: "République Démocratique du Congo",
            amenities: [],
            maxGuests: 2,
            bedrooms: 1,
            bathrooms: 1,
            latitude: -4.325, // Kinshasa par défaut
            longitude: 15.3222,
            imageUrls: [],
        },
    });

    // --- Gestion de l'upload d'images ---
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImageFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
        maxSize: 5 * 1024 * 1024, // 5MB
    });

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImagesToCloudinary = async (): Promise<string[]> => {
        setIsUploading(true);
        const uploadedUrls: string[] = [];
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

        for (const file of imageFiles) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                uploadedUrls.push(data.secure_url);
            } catch (error) {
                console.error("Erreur d'upload sur Cloudinary", error);
                sonnerToast.error("Une erreur est survenue lors de l'upload d'une image.");
                setIsUploading(false);
                return []; // Retourner un tableau vide en cas d'erreur
            }
        }
        setIsUploading(false);
        return uploadedUrls;
    };

    // --- Soumission du formulaire ---
    async function onSubmit(data: CreateListingInput) {
        if (imageFiles.length === 0) {
            form.setError('imageUrls', { type: 'manual', message: 'Veuillez ajouter au moins une image.' });
            return;
        }

        const uploadedUrls = await uploadImagesToCloudinary();
        if (uploadedUrls.length !== imageFiles.length) {
            // Un upload a échoué, on arrête
            return;
        }

        const finalData = { ...data, imageUrls: uploadedUrls };

        sonnerToast.promise(dispatch(createListing(finalData)).unwrap(), {
            loading: 'Création du logement en cours...',
            success: (newListing) => {
                onSuccess(); // Ferme le modal
                router.push('/host/dashboard'); // Redirige vers le dashboard
                return `Le logement "${newListing.title}" a été créé avec succès !`;
            },
            error: (error) => {
                return error.message || "Une erreur est survenue lors de la création.";
            }
        });
    }

    const isLoading = isCreating || isUploading;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto pr-4">
                {/* --- Champs de base --- */}
                <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Titre</FormLabel><FormControl><Input placeholder="Villa moderne avec vue" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Décrivez votre logement..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Type de logement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {Object.values(ListingType).map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select><FormMessage />
                    </FormItem>
                )} />

                {/* --- Upload d'images --- */}
                <div>
                    <FormLabel>Photos (au moins 1)</FormLabel>
                    <div {...getRootProps()} className={`mt-2 flex justify-center items-center p-6 border-2 border-dashed rounded-md cursor-pointer ${isDragActive ? 'border-primary' : 'border-border'}`}>
                        <input {...getInputProps()} />
                        <div className="text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez vos images ici, ou cliquez pour sélectionner</p>
                            <p className="text-xs text-muted-foreground/80">PNG, JPG, WEBP jusqu'à 5MB</p>
                        </div>
                    </div>
                    {imageFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {imageFiles.map((file, index) => (
                                <div key={index} className="relative">
                                    <img src={URL.createObjectURL(file)} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    <FormMessage>{form.formState.errors.imageUrls?.message}</FormMessage>
                </div>

                {/* --- Adresse & Géolocalisation --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Adresse</FormLabel><FormControl><Input placeholder="123, Av. de la Libération" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>Ville</FormLabel><FormControl><Input placeholder="Goma" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                {/* Note: Province/Country, Latitude/Longitude sont fixes ou pourraient être des champs cachés mis à jour par une API de géocodage */}

                {/* --- Détails du logement --- */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Prix/nuit ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="maxGuests" render={({ field }) => (<FormItem><FormLabel>Voyageurs max.</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="bedrooms" render={({ field }) => (<FormItem><FormLabel>Chambres</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel>Salles de bain</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>

                {/* --- Équipements --- */}
                <FormField control={form.control} name="amenities" render={() => (
                    <FormItem>
                        <FormLabel>Équipements</FormLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {amenitiesList.map((item) => (
                                <FormField key={item} control={form.control} name="amenities" render={({ field }) => (
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item)}
                                                onCheckedChange={(checked) => {
                                                    const updatedAmenities = checked
                                                        ? [...(field.value || []), item]
                                                        : (field.value || []).filter((value) => value !== item);
                                                    field.onChange(updatedAmenities);
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">{item}</FormLabel>
                                    </FormItem>
                                )} />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Publication en cours...' : 'Publier le logement'}
                </Button>
            </form>
        </Form>
    );
}