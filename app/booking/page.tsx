"use client";

import { Layout } from '@/components/Layout';
import { BookingForm } from '@/components/BookingForm';

export default function Booking() {
  const handleBooking = (bookingData: any) => {
    // Process the booking data
    // Integrate with a booking API or database
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-4xl font-bold mb-4">Booking</h1>
        <BookingForm onSubmit={handleBooking} />
      </div>
    </Layout>
  );
}
