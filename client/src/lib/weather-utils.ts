export function getWeatherIcon(iconCode: string): string {
  const iconMap: Record<string, string> = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog',
  };
  
  return iconMap[iconCode] || 'fas fa-cloud';
}

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9/5) + 32);
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5/9);
}

export function formatTemperature(temp: number, unit: 'C' | 'F'): string {
  return `${temp}°${unit}`;
}

export function getAirQualityColor(aqi: number): string {
  if (aqi <= 1) return 'text-green-600';
  if (aqi <= 2) return 'text-yellow-600';
  if (aqi <= 3) return 'text-orange-600';
  if (aqi <= 4) return 'text-red-600';
  return 'text-purple-600';
}

export function getAirQualityBgColor(aqi: number): string {
  if (aqi <= 1) return 'bg-green-500';
  if (aqi <= 2) return 'bg-yellow-500';
  if (aqi <= 3) return 'bg-orange-500';
  if (aqi <= 4) return 'bg-red-500';
  return 'bg-purple-500';
}

export function formatWindSpeed(speed: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    return `${Math.round(speed * 0.621371)} mph`;
  }
  return `${speed} km/h`;
}
