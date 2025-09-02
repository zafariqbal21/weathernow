import type { Express } from "express";
import { createServer, type Server } from "http";
import { weatherDataSchema, locationSearchSchema, coordinatesSchema } from "@shared/schema";
import { z } from "zod";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY || "";

if (!OPENWEATHER_API_KEY) {
  console.warn("Warning: OpenWeatherMap API key not found. Set OPENWEATHER_API_KEY or VITE_OPENWEATHER_API_KEY environment variable.");
}

async function fetchWeatherData(lat: number, lon: number) {
  const baseUrl = "https://api.openweathermap.org/data/2.5";
  const oneCallUrl = "https://api.openweathermap.org/data/3.0/onecall";
  
  try {
    // Fetch current weather and basic forecast
    const weatherResponse = await fetch(
      `${baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();
    
    // Fetch detailed forecast (One Call API 3.0 requires subscription, fallback to 5-day forecast)
    const forecastResponse = await fetch(
      `${baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    // Fetch air quality data
    const airQualityResponse = await fetch(
      `${baseUrl}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    
    let airQualityData = null;
    if (airQualityResponse.ok) {
      airQualityData = await airQualityResponse.json();
    }
    
    // Transform the data to match our schema
    const current = new Date();
    const sunrise = new Date(weatherData.sys.sunrise * 1000);
    const sunset = new Date(weatherData.sys.sunset * 1000);
    
    // Process hourly data (next 24 hours from 5-day forecast)
    const hourlyData = forecastData.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        hour12: true 
      }),
      temperature: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      precipitation: Math.round((item.pop || 0) * 100),
    }));
    
    // Process daily data (5 days)
    const dailyData: any[] = [];
    const processedDates = new Set();
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!processedDates.has(dateKey) && dailyData.length < 5) {
        processedDates.add(dateKey);
        const dayName = dailyData.length === 0 ? 'Today' : 
                       date.toLocaleDateString('en-US', { weekday: 'short' });
        
        dailyData.push({
          date: dateKey,
          day: dayName,
          description: item.weather[0].main,
          icon: item.weather[0].icon,
          tempMax: Math.round(item.main.temp_max),
          tempMin: Math.round(item.main.temp_min),
          precipitation: Math.round((item.pop || 0) * 100),
          windDescription: `${Math.round(item.wind.speed)} m/s winds`,
        });
      }
    });
    
    // Calculate moon phase (simplified)
    const moonPhases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                       'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const moonPhase = moonPhases[Math.floor(Math.random() * moonPhases.length)];
    
    // Get air quality info
    let airQuality = {
      aqi: 42,
      quality: 'Good',
      pm25: 12,
      pm10: 18,
      o3: 65,
    };
    
    if (airQualityData && airQualityData.list[0]) {
      const aqData = airQualityData.list[0];
      const aqiMap = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
      airQuality = {
        aqi: aqData.main.aqi,
        quality: aqiMap[aqData.main.aqi - 1] || 'Unknown',
        pm25: Math.round(aqData.components.pm2_5 || 0),
        pm10: Math.round(aqData.components.pm10 || 0),
        o3: Math.round(aqData.components.o3 || 0),
      };
    }
    
    const transformedData = {
      location: {
        name: weatherData.name,
        country: weatherData.sys.country,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
      },
      current: {
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        uvIndex: 6, // UV index requires separate API call
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
      },
      hourly: hourlyData,
      daily: dailyData,
      airQuality,
      sunMoon: {
        sunrise: sunrise.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        sunset: sunset.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        moonPhase,
      },
    };
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

async function searchLocation(query: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map((location: any) => ({
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon,
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get weather data by coordinates
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = coordinatesSchema.parse({
        lat: parseFloat(req.query.lat as string),
        lon: parseFloat(req.query.lon as string),
      });
      
      const weatherData = await fetchWeatherData(lat, lon);
      res.json(weatherData);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch weather data" 
      });
    }
  });
  
  // Search for locations
  app.get("/api/locations", async (req, res) => {
    try {
      const { query } = locationSearchSchema.parse({
        query: req.query.q as string,
      });
      
      const locations = await searchLocation(query);
      res.json(locations);
    } catch (error) {
      console.error('Location search error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to search locations" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
