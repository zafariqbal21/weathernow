import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWeatherIcon, formatTemperature, formatWindSpeed } from '@/lib/weather-utils';
import type { WeatherData } from '@shared/schema';

interface CurrentWeatherProps {
  data: WeatherData;
  temperatureUnit: 'C' | 'F';
  onToggleUnit: () => void;
}

export function CurrentWeather({ data, temperatureUnit, onToggleUnit }: CurrentWeatherProps) {
  const { location, current } = data;
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const displayTemp = temperatureUnit === 'F' 
    ? Math.round((current.temperature * 9/5) + 32)
    : current.temperature;

  const displayFeelsLike = temperatureUnit === 'F'
    ? Math.round((current.feelsLike * 9/5) + 32)
    : current.feelsLike;

  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden fade-in">
      <div className="weather-gradient p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold" data-testid="text-location-name">
              {location.name}, {location.country}
            </h2>
            <p className="text-white/80 text-sm" data-testid="text-current-time">
              {currentTime}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            data-testid="button-settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <div className="text-5xl font-light" data-testid="text-temperature">
                {formatTemperature(displayTemp, temperatureUnit)}
              </div>
              <div className="text-white/80 capitalize" data-testid="text-weather-description">
                {current.description}
              </div>
            </div>
            <div className="text-6xl">
              <i className={getWeatherIcon(current.icon)} data-testid="icon-weather"></i>
            </div>
          </div>
          
          <div className="text-right">
            <Button
              onClick={onToggleUnit}
              variant="ghost"
              className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
              data-testid="button-toggle-unit"
            >
              °F | °C
            </Button>
          </div>
        </div>
      </div>
      
      {/* Weather Details Grid */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-muted-foreground text-sm mb-1">Feels Like</div>
          <div className="font-semibold text-lg" data-testid="text-feels-like">
            {formatTemperature(displayFeelsLike, temperatureUnit)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-sm mb-1">Humidity</div>
          <div className="font-semibold text-lg" data-testid="text-humidity">
            {current.humidity}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-sm mb-1">Wind Speed</div>
          <div className="font-semibold text-lg" data-testid="text-wind-speed">
            {formatWindSpeed(current.windSpeed, 'metric')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-sm mb-1">UV Index</div>
          <div className="font-semibold text-lg" data-testid="text-uv-index">
            {current.uvIndex}
          </div>
        </div>
      </div>
    </div>
  );
}
