import { NextResponse } from 'next/server';
import { searchFlights } from '@/lib/travelApi';

export async function GET() {
  try {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 30); // Search 30 days from now
    
    const departureDateStr = futureDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const searchParams = {
      originLocationCode: 'LHR',
      destinationLocationCode: 'CDG',
      departureDate: departureDateStr,
      adults: 1,
      max: 5,
      currencyCode: 'USD'
    };

    console.log('Searching with params:', searchParams);

    const flights = await searchFlights(searchParams);
    
    return NextResponse.json({ 
      success: true, 
      searchParams,
      data: flights 
    });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.response?.data || error.message,
      stack: error.stack
    }, { 
      status: error.response?.status || 500 
    });
  }
}