"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast as sonnerToast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { AppDispatch } from '@/redux/store';
import { createBooking, selectIsBookingBeingCreated } from '@/redux/slices/bookingSlice';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

interface BookingPopoverProps {
  listingId: string;
  pricePerNight: number;
}

export function BookingPopover({ listingId, pricePerNight }: BookingPopoverProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isCreatingBooking = useSelector(selectIsBookingBeingCreated);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  const handleBooking = () => {
    if (!dateRange?.from || !dateRange?.to) {
      sonnerToast.warning("Veuillez sélectionner une plage de dates.");
      return;
    }

    const bookingData = {
      listingId,
      startDate: dateRange.from,
      endDate: dateRange.to,
    };

    sonnerToast.promise(dispatch(createBooking(bookingData)).unwrap(), {
      loading: 'Vérification et réservation...',
      success: () => {
        setIsOpen(false); // Ferme le popover en cas de succès
        return 'Réservation confirmée !';
      },
      error: (err) => err.message || 'La réservation a échoué.',
    });
  };

  const nights = dateRange?.from && dateRange?.to ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights > 0 ? (nights * pricePerNight).toFixed(2) : 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" className="w-full mt-2">Réserver</Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-4">
        <p className="font-semibold">Choisissez vos dates</p>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={1}
          disabled={{ before: new Date() }}
        />
        {nights > 0 && (
          <div className="text-sm">
            <p><b>Total pour {nights} nuit{nights > 1 ? 's' : ''} :</b> {totalPrice} €</p>
          </div>
        )}
        <Button onClick={handleBooking} disabled={isCreatingBooking || nights <= 0} className="w-full">
          {isCreatingBooking ? "Confirmation..." : "Confirmer la réservation"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}