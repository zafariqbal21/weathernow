import { Clock } from 'lucide-react';
import { getWeatherIcon } from '@/lib/weather-utils';
import type { WeatherData } from '@shared/schema';

interface HourlyForecastProps {
  data: WeatherData;
  temperatureUnit: 'C' | 'F';
}

export function HourlyForecast({ data, temperatureUnit }: HourlyForecastProps) {
  const { hourly } = data;

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Clock className="mr-2 text-primary w-5 h-5" />
        24-Hour Forecast
      </h3>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {hourly.map((hour, index) => {
            const displayTemp = temperatureUnit === 'F' 
              ? Math.round((hour.temperature * 9/5) + 32)
              : hour.temperature;

            return (
              <div 
                key={index}
                className="flex-shrink-0 text-center bg-muted/50 rounded-lg p-3 min-w-[80px]"
                data-testid={`card-hourly-${index}`}
              >
                <div className="text-sm text-muted-foreground mb-2" data-testid={`text-hour-${index}`}>
                  {hour.time}
                </div>
                <i className={`${getWeatherIcon(hour.icon)} text-2xl text-primary mb-2`} 
                   data-testid={`icon-hourly-${index}`}></i>
                <div className="font-semibold" data-testid={`text-hourly-temp-${index}`}>
                  {displayTemp}°
                </div>
                <div className="text-xs text-blue-500 mt-1" data-testid={`text-hourly-precipitation-${index}`}>
                  {hour.precipitation}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
