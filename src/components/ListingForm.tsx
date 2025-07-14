"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListingSchema, CreateListingInput } from '@/lib/utils/validation.schemas';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createListing, selectIsCreatingListing } from '@/redux/slices/listingSlice';
import { toast as sonnerToast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';



const amenitiesList = ["Wifi", "Télévision", "Cuisine", "Climatisation", "Piscine", "Parking gratuit"];

export function ListingForm({ onSuccess }: { onSuccess: () => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const isCreating = useSelector(selectIsCreatingListing);

    const form = useForm<CreateListingInput>({
        resolver: zodResolver(createListingSchema),
        defaultValues: {
            title: "",
            description: "",
            type: "Appartement",
            price: 100,
            address: "",
            city: "",
            country: "République Démocratique du Congo",
            amenities: [],
            maxGuests: 2,
            bedrooms: 1,
            bathrooms: 1,
        },
    });

    async function onSubmit(data: CreateListingInput) {
        sonnerToast.promise(dispatch(createListing(data)).unwrap(), {
            loading: 'Création du logement en cours...',
            success: () => {
                onSuccess(); // Appelle la fonction pour fermer le popup
                form.reset(); // Réinitialise le formulaire
                return "Votre logement a été créé avec succès !";
            },
            error: (error) => {
                // L'erreur ici est la valeur de rejectWithValue
                return error.message || "Une erreur est survenue lors de la création.";
            }
        });
    }

    return (
        // Le composant Form de shadcn/ui connecte react-hook-form
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre de l'annonce</FormLabel>
                            <FormControl>
                                <Input placeholder="ex: Villa moderne avec vue sur le lac" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Décrivez votre logement en détail..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem><FormLabel>Prix/nuit (€)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="maxGuests" render={({ field }) => (
                        <FormItem><FormLabel>Voyageurs max.</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="bedrooms" render={({ field }) => (
                        <FormItem><FormLabel>Chambres</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="bathrooms" render={({ field }) => (
                        <FormItem><FormLabel>Salles de bain</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <FormField
                    control={form.control}
                    name="amenities"
                    render={() => (
                        <FormItem>
                            <FormLabel>Équipements</FormLabel>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {amenitiesList.map((item) => (
                                    <FormField key={item} control={form.control} name="amenities" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...field.value, item])
                                                            : field.onChange(field.value?.filter((value) => value !== item));
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
                    )}
                />

                <Button type="submit" disabled={isCreating} className="w-full">
                    {isCreating ? 'Création en cours...' : 'Créer le logement'}
                </Button>
            </form>
        </Form>
    );
}