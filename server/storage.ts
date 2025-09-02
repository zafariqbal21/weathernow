import { type WeatherData, type Coordinates } from "@shared/schema";

export interface IStorage {
  // Weather data is fetched from API, no persistent storage needed
  // This interface is kept for consistency but not actively used
}

export class MemStorage implements IStorage {
  constructor() {
    // No persistent storage needed for weather data
  }
}

export const storage = new MemStorage();
