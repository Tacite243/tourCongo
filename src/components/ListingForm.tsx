"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast as sonnerToast } from "sonner";

import { createListingSchema, CreateListingInput } from '@/lib/utils/validation.schemas';
import { AppDispatch } from '@/redux/store';
import { createListing, selectIsCreatingListing } from '@/redux/slices/listingSlice';
import { ListingType } from '@prisma/client';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from './ImageUploader';
import { selectIsUploading } from '@/redux/slices/uploadSlice';

const amenitiesList = ["Wifi", "Télévision", "Cuisine", "Climatisation", "Piscine", "Parking gratuit", "Salle de sport", "Jacuzzi"];

// Le onSuccess sera utilisé pour fermer le popup/modal qui contient ce formulaire
export function ListingForm({ onSuccess }: { onSuccess: () => void }) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const isCreating = useSelector(selectIsCreatingListing);
    const isUploading = useSelector(selectIsUploading);

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

    // Cette fonction est passée à ImageUploader et met à jour le formulaire
    const handleUploadSuccess = (urls: string[]) => {
        const currentUrls = form.getValues('imageUrls');
        form.setValue('imageUrls', [...currentUrls, ...urls]);
        // Déclencher la validation pour ce champ
        form.trigger('imageUrls');
    };

    // --- Soumission du formulaire ---
    async function onSubmit(data: CreateListingInput) {
        sonnerToast.promise(dispatch(createListing(data)).unwrap(), {
            loading: 'Publication du logement en cours...',
            success: (newListing) => {
                onSuccess(); // Ferme le modal
                router.push('/host/dashboard'); // Redirige
                return `Annonce "${newListing.title}" publiée !`;
            },
            error: (error) => error.message || "Une erreur est survenue."
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
                <FormField
                    control={form.control}
                    name="imageUrls"
                    render={() => (
                        <FormItem>
                            <FormLabel>Photos du logement</FormLabel>
                            <FormControl>
                                <ImageUploader onUploadSuccess={handleUploadSuccess} />
                            </FormControl>
                            <FormDescription>
                                Ajoutez au moins une photo de haute qualité.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


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