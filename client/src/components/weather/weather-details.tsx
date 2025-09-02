import { Wind, Sun, Moon } from 'lucide-react';
import { getAirQualityColor, getAirQualityBgColor } from '@/lib/weather-utils';
import type { WeatherData } from '@shared/schema';

interface WeatherDetailsProps {
  data: WeatherData;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  const { airQuality, sunMoon } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Air Quality Card */}
      <div className="bg-card rounded-xl shadow-lg p-6 fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Wind className="mr-2 text-primary w-5 h-5" />
          Air Quality
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AQI</span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 ${getAirQualityBgColor(airQuality.aqi)} rounded-full`}></div>
              <span className="font-semibold" data-testid="text-aqi-value">
                {airQuality.aqi}
              </span>
              <span className={`text-sm ${getAirQualityColor(airQuality.aqi)}`} data-testid="text-aqi-quality">
                {airQuality.quality}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">PM2.5</span>
              <span className="text-xs font-medium" data-testid="text-pm25">
                {airQuality.pm25} μg/m³
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">PM10</span>
              <span className="text-xs font-medium" data-testid="text-pm10">
                {airQuality.pm10} μg/m³
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">O₃</span>
              <span className="text-xs font-medium" data-testid="text-o3">
                {airQuality.o3} μg/m³
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sun & Moon Card */}
      <div className="bg-card rounded-xl shadow-lg p-6 fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Sun className="mr-2 text-accent w-5 h-5" />
          Sun & Moon
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="text-accent w-4 h-4" />
              <span className="text-sm">Sunrise</span>
            </div>
            <span className="font-semibold" data-testid="text-sunrise">
              {sunMoon.sunrise}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="text-orange-500 w-4 h-4" />
              <span className="text-sm">Sunset</span>
            </div>
            <span className="font-semibold" data-testid="text-sunset">
              {sunMoon.sunset}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon className="text-indigo-400 w-4 h-4" />
              <span className="text-sm">Moon Phase</span>
            </div>
            <span className="font-semibold" data-testid="text-moon-phase">
              {sunMoon.moonPhase}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
