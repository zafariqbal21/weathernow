import { z } from "zod";

export const weatherDataSchema = z.object({
  location: z.object({
    name: z.string(),
    country: z.string(),
    lat: z.number(),
    lon: z.number(),
  }),
  current: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    uvIndex: z.number(),
    description: z.string(),
    icon: z.string(),
  }),
  hourly: z.array(z.object({
    time: z.string(),
    temperature: z.number(),
    icon: z.string(),
    precipitation: z.number(),
  })),
  daily: z.array(z.object({
    date: z.string(),
    day: z.string(),
    description: z.string(),
    icon: z.string(),
    tempMax: z.number(),
    tempMin: z.number(),
    precipitation: z.number(),
    windDescription: z.string(),
  })),
  airQuality: z.object({
    aqi: z.number(),
    quality: z.string(),
    pm25: z.number(),
    pm10: z.number(),
    o3: z.number(),
  }),
  sunMoon: z.object({
    sunrise: z.string(),
    sunset: z.string(),
    moonPhase: z.string(),
  }),
});

export const locationSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

export const coordinatesSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;
export type LocationSearch = z.infer<typeof locationSearchSchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>;
