"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast as sonnerToast } from "sonner";

import { createListingSchema, CreateListingInput } from '@/lib/utils/validation.schemas';
import { AppDispatch } from '@/redux/store';
import { createListing, selectIsCreatingListing } from '@/redux/slices/listingSlice';
import { compressAndUploadFiles, selectIsUploading } from '@/redux/slices/uploadSlice';
import { ListingType } from '@prisma/client';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from './ImageUploader';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';


const amenitiesList = ["Wifi", "Télévision", "Cuisine", "Climatisation", "Piscine", "Parking gratuit", "Salle de sport", "Jacuzzi"];

export function ListingForm({ onSuccess }: { onSuccess: () => void }) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const isCreating = useSelector(selectIsCreatingListing);
    const isUploading = useSelector(selectIsUploading);

    // État pour stocker les objets File bruts sélectionnés par l'utilisateur
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    // --- AMÉLIORATION : État local pour le calendrier pour une meilleure réactivité de l'UI ---
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const form = useForm<CreateListingInput>({
        resolver: zodResolver(createListingSchema),
        defaultValues: {
            title: "", description: "", type: ListingType.APPARTEMENT,
            price: 50, address: "", city: "", country: "République Démocratique du Congo",
            amenities: [], maxGuests: 2, bedrooms: 1, bathrooms: 1,
            latitude: -4.325, longitude: 15.3222,
            imageUrls: [],
            // Initialiser les dates à undefined
            availableFrom: undefined,
            availableTo: undefined,
        },
    });

    // Cet effet se déclenchera à chaque fois que `imageFiles` change.
    useEffect(() => {
        console.log('[ListingForm] L\'état imageFiles a été mis à jour. Nombre de fichiers :', imageFiles.length);

        // Si des fichiers ont été ajoutés, on peut effacer l'erreur de validation manuellement
        if (imageFiles.length > 0) {
            form.clearErrors('imageUrls');
        }

    }, [imageFiles, form]); // `form` est inclus dans les dépendances pour appeler `clearErrors` en toute sécurité

    // --- ORCHESTRATION DE LA SOUMISSION ---
    async function onSubmit(formData: CreateListingInput) {

        // Étape 1: Valider la présence d'images sélectionnées par l'utilisateur.
        if (imageFiles.length === 0) {
            form.setError('imageUrls', { message: 'Veuillez sélectionner au moins une image.' });
            return;
        }

        let uploadedUrls: string[];
        try {
            // Étape 2: Déclencher l'upload et ATTENDRE la fin.
            sonnerToast.loading('Compression et upload des images...');
            // .unwrap() retourne une promesse que l'on peut 'await'
            uploadedUrls = await dispatch(compressAndUploadFiles(imageFiles)).unwrap();
            sonnerToast.success('Images uploadées avec succès !');

        } catch (error: unknown) {
            console.error("L'upload a échoué :", error);
            const message = error instanceof Error ? error.message : "L'upload des images a échoué.";
            sonnerToast.error(message);
            return;
        }

        // Si on arrive ici, l'upload a réussi et `uploadedUrls` contient les liens.

        // Étape 3: Mettre à jour les données du formulaire avec les URLs.
        const finalData = { ...formData, imageUrls: uploadedUrls };

        // Étape 4: Soumettre le formulaire complet au backend.
        try {
            sonnerToast.loading('Publication de l\'annonce...');
            const newListing = await dispatch(createListing(finalData)).unwrap();

            sonnerToast.success(`Annonce "${newListing.title}" publiée avec succès !`);
            onSuccess(); // Ferme le modal
            router.push('/host/dashboard'); // Redirige

        } catch (error: unknown) {
            console.error("La création du listing a échoué :", error);
            const message = error instanceof Error ? error.message : "La publication de l'annonce a échoué.";
            sonnerToast.error(message);
        }
    };

    const isLoading = isCreating || isUploading;

    return (
        <Form {...form}>
            {/* Le handleSubmit de react-hook-form exécute la validation Zod sur les champs de texte
                AVANT d'appeler notre fonction `onSubmit`. */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto p-1 pr-4">

                {/* --- Champs de base --- */}
                <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Titre</FormLabel><FormControl><Input placeholder="Villa moderne avec vue" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Décrivez votre logement..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {Object.values(ListingType).map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select><FormMessage />
                    </FormItem>
                )} />
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

                {/* --- CHAMP DE DATE DE DISPONIBILITÉ --- */}
                <FormField
                    control={form.control}
                    name="availableFrom" // Le message d'erreur de Zod s'attachera ici
                    render={() => (
                        <FormItem className="flex flex-col">
                            <FormLabel className={cn((form.formState.errors.availableFrom || form.formState.errors.availableTo) && "text-destructive")}>
                                Période de disponibilité initiale
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal", !dateRange?.from && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(dateRange.from, "dd LLL, y", { locale: fr })} -{" "}
                                                    {format(dateRange.to, "dd LLL, y", { locale: fr })}
                                                </>
                                            ) : (
                                                format(dateRange.from, "dd LLL, y", { locale: fr })
                                            )
                                        ) : (
                                            <span>Choisissez une plage de dates</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={(range) => {
                                            // 1. Mettre à jour l'état local pour rafraîchir l'UI
                                            setDateRange(range);

                                            // 2. Mettre à jour le formulaire de manière "type-safe"
                                            // Si range.from est undefined, on passe `undefined`, sinon on passe la date.
                                            if (range?.from) {
                                                form.setValue("availableFrom", range.from);
                                            }
                                            if (range?.to) {
                                                form.setValue("availableTo", range.to);
                                            }


                                            form.trigger("availableFrom");
                                            form.trigger("availableTo");


                                            // 3. Déclencher la validation pour un feedback immédiat
                                            if (range?.from) form.trigger("availableFrom");
                                            if (range?.to) form.trigger("availableTo");
                                        }}
                                        numberOfMonths={2}
                                        disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Définissez la première plage de dates où votre logement est disponible.
                            </FormDescription>
                            {/* Le message d'erreur pour `availableFrom` ou `availableTo` s'affichera ici */}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* --- Champ pour l'upload d'images --- */}
                <FormField
                    control={form.control}
                    name="imageUrls"
                    render={() => (
                        <FormItem>
                            <FormLabel className={cn(form.formState.errors.imageUrls && "text-destructive")}>
                                Photos du logement
                            </FormLabel>
                            <FormControl>
                                <ImageUploader onFilesChange={setImageFiles} />
                            </FormControl>
                            <FormDescription>
                                Ajoutez au moins une photo. Elles seront uploadées lors de la publication.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    {isUploading ? 'Upload des images...' : (isCreating ? 'Finalisation...' : 'Publier le logement')}
                </Button>
            </form>
        </Form>
    );
}