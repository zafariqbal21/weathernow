import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Custom query function for weather API calls
export const weatherQueryFn: QueryFunction = async ({ queryKey }) => {
  const [endpoint, ...params] = queryKey as string[];
  
  if (endpoint === '/api/weather') {
    const [lat, lon] = params;
    return await fetchWeatherData(Number(lat), Number(lon));
  }
  
  if (endpoint === '/api/locations') {
    const [query] = params;
    return await fetchLocationSuggestions(query);
  }
  
  throw new Error(`Unknown endpoint: ${endpoint}`);
};

// Weather API functions
const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";

if (!WEATHER_API_KEY) {
  console.warn("Warning: WeatherAPI key not found. Set VITE_OPENWEATHER_API_KEY environment variable.");
}

function getWeatherApiIcon(code: number, isDay: number): string {
  const iconMap: Record<number, { day: string, night: string }> = {
    1000: { day: '01d', night: '01n' }, // Sunny/Clear
    1003: { day: '02d', night: '02n' }, // Partly cloudy
    1006: { day: '03d', night: '03n' }, // Cloudy
    1009: { day: '04d', night: '04n' }, // Overcast
    1030: { day: '50d', night: '50n' }, // Mist
    1063: { day: '10d', night: '10n' }, // Patchy rain possible
    1066: { day: '13d', night: '13n' }, // Patchy snow possible
    1069: { day: '13d', night: '13n' }, // Patchy sleet possible
    1072: { day: '09d', night: '09n' }, // Patchy freezing drizzle possible
    1087: { day: '11d', night: '11n' }, // Thundery outbreaks possible
    1114: { day: '13d', night: '13n' }, // Blowing snow
    1117: { day: '13d', night: '13n' }, // Blizzard
    1135: { day: '50d', night: '50n' }, // Fog
    1147: { day: '50d', night: '50n' }, // Freezing fog
    1150: { day: '09d', night: '09n' }, // Patchy light drizzle
    1153: { day: '09d', night: '09n' }, // Light drizzle
    1168: { day: '09d', night: '09n' }, // Freezing drizzle
    1171: { day: '09d', night: '09n' }, // Heavy freezing drizzle
    1180: { day: '10d', night: '10n' }, // Patchy light rain
    1183: { day: '10d', night: '10n' }, // Light rain
    1186: { day: '10d', night: '10n' }, // Moderate rain at times
    1189: { day: '10d', night: '10n' }, // Moderate rain
    1192: { day: '09d', night: '09n' }, // Heavy rain at times
    1195: { day: '09d', night: '09n' }, // Heavy rain
    1198: { day: '09d', night: '09n' }, // Light freezing rain
    1201: { day: '09d', night: '09n' }, // Moderate or heavy freezing rain
    1204: { day: '13d', night: '13n' }, // Light sleet
    1207: { day: '13d', night: '13n' }, // Moderate or heavy sleet
    1210: { day: '13d', night: '13n' }, // Patchy light snow
    1213: { day: '13d', night: '13n' }, // Light snow
    1216: { day: '13d', night: '13n' }, // Patchy moderate snow
    1219: { day: '13d', night: '13n' }, // Moderate snow
    1222: { day: '13d', night: '13n' }, // Patchy heavy snow
    1225: { day: '13d', night: '13n' }, // Heavy snow
    1237: { day: '13d', night: '13n' }, // Ice pellets
    1240: { day: '09d', night: '09n' }, // Light rain shower
    1243: { day: '09d', night: '09n' }, // Moderate or heavy rain shower
    1246: { day: '09d', night: '09n' }, // Torrential rain shower
    1249: { day: '13d', night: '13n' }, // Light sleet showers
    1252: { day: '13d', night: '13n' }, // Moderate or heavy sleet showers
    1255: { day: '13d', night: '13n' }, // Light snow showers
    1258: { day: '13d', night: '13n' }, // Moderate or heavy snow showers
    1261: { day: '13d', night: '13n' }, // Light showers of ice pellets
    1264: { day: '13d', night: '13n' }, // Moderate or heavy showers of ice pellets
    1273: { day: '11d', night: '11n' }, // Patchy light rain with thunder
    1276: { day: '11d', night: '11n' }, // Moderate or heavy rain with thunder
    1279: { day: '11d', night: '11n' }, // Patchy light snow with thunder
    1282: { day: '11d', night: '11n' }, // Moderate or heavy snow with thunder
  };

  const icons = iconMap[code] || { day: '01d', night: '01n' };
  return isDay ? icons.day : icons.night;
}

function getAirQualityText(aqi: number): string {
  const aqiMap = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
  return aqiMap[aqi - 1] || 'Unknown';
}

function formatTime(timeStr: string): string {
  return timeStr.replace(/^0/, '');
}

async function fetchWeatherData(lat: number, lon: number) {
  const baseUrl = "https://api.weatherapi.com/v1";
  
  try {
    const weatherResponse = await fetch(
      `${baseUrl}/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=5&aqi=yes&alerts=no`
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }
    
    const data = await weatherResponse.json();
    
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast;
    
    const today = forecast.forecastday[0];
    const tomorrow = forecast.forecastday[1] || { hour: [] };
    const allHours = [...today.hour, ...tomorrow.hour];
    const currentHour = new Date().getHours();
    const hourlyData = allHours
      .slice(currentHour, currentHour + 8)
      .map((item: any) => ({
        time: new Date(item.time).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          hour12: true 
        }),
        temperature: Math.round(item.temp_c),
        icon: getWeatherApiIcon(item.condition.code, item.is_day),
        precipitation: Math.round(item.chance_of_rain || 0),
      }));
    
    const dailyData = forecast.forecastday.map((day: any, index: number) => {
      const dayName = index === 0 ? 'Today' : 
                     new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        date: day.date,
        day: dayName,
        description: day.day.condition.text,
        icon: getWeatherApiIcon(day.day.condition.code, 1),
        tempMax: Math.round(day.day.maxtemp_c),
        tempMin: Math.round(day.day.mintemp_c),
        precipitation: Math.round(day.day.daily_chance_of_rain || 0),
        windDescription: `${Math.round(day.day.maxwind_kph)} km/h winds`,
      };
    });
    
    const airQuality = {
      aqi: current.air_quality?.['us-epa-index'] || 1,
      quality: getAirQualityText(current.air_quality?.['us-epa-index'] || 1),
      pm25: Math.round(current.air_quality?.pm2_5 || 0),
      pm10: Math.round(current.air_quality?.pm10 || 0),
      o3: Math.round(current.air_quality?.o3 || 0),
    };
    
    const astro = today.astro;
    
    return {
      location: {
        name: location.name,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
      },
      current: {
        temperature: Math.round(current.temp_c),
        feelsLike: Math.round(current.feelslike_c),
        humidity: current.humidity,
        windSpeed: Math.round(current.wind_kph),
        uvIndex: Math.round(current.uv || 0),
        description: current.condition.text,
        icon: getWeatherApiIcon(current.condition.code, current.is_day),
      },
      hourly: hourlyData,
      daily: dailyData,
      airQuality,
      sunMoon: {
        sunrise: formatTime(astro.sunrise),
        sunset: formatTime(astro.sunset),
        moonPhase: astro.moon_phase,
      },
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

async function fetchLocationSuggestions(query: string) {
  const baseUrl = "https://api.weatherapi.com/v1";
  
  try {
    const response = await fetch(
      `${baseUrl}/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error(`Location API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((location: any) => ({
      name: location.name,
      country: location.country,
      region: location.region,
      lat: location.lat,
      lon: location.lon,
    }));
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    throw error;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: weatherQueryFn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
