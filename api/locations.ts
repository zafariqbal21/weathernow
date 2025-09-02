import type { VercelRequest, VercelResponse } from '@vercel/node';
import { locationSearchSchema } from '../shared/schema';

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY || "";

async function searchLocation(query: string) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map((location: any) => ({
      name: location.name,
      country: location.country,
      state: location.region,
      lat: location.lat,
      lon: location.lon,
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { query } = locationSearchSchema.parse({
      query: req.query.q as string,
    });
    
    const locations = await searchLocation(query);
    res.status(200).json(locations);
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Failed to search locations" 
    });
  }
}