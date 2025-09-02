import { CalendarDays, Droplets } from 'lucide-react';
import { getWeatherIcon } from '@/lib/weather-utils';
import type { WeatherData } from '@shared/schema';

interface WeeklyForecastProps {
  data: WeatherData;
  temperatureUnit: 'C' | 'F';
}

export function WeeklyForecast({ data, temperatureUnit }: WeeklyForecastProps) {
  const { daily } = data;

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 fade-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <CalendarDays className="mr-2 text-primary w-5 h-5" />
        5-Day Forecast
      </h3>
      
      <div className="space-y-3">
        {daily.map((day, index) => {
          const displayTempMax = temperatureUnit === 'F' 
            ? Math.round((day.tempMax * 9/5) + 32)
            : day.tempMax;
            
          const displayTempMin = temperatureUnit === 'F'
            ? Math.round((day.tempMin * 9/5) + 32)
            : day.tempMin;

          return (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              data-testid={`card-daily-${index}`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-16 text-sm font-medium" data-testid={`text-day-${index}`}>
                  {day.day}
                </div>
                <i className={`${getWeatherIcon(day.icon)} text-xl text-primary w-8`} 
                   data-testid={`icon-daily-${index}`}></i>
                <div className="flex-1">
                  <div className="text-sm font-medium" data-testid={`text-daily-description-${index}`}>
                    {day.description}
                  </div>
                  <div className="text-xs text-muted-foreground" data-testid={`text-daily-wind-${index}`}>
                    {day.windDescription}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-blue-500 flex items-center" data-testid={`text-daily-precipitation-${index}`}>
                  <Droplets className="w-3 h-3 mr-1" />
                  {day.precipitation}%
                </span>
                <div className="text-right">
                  <span className="font-semibold" data-testid={`text-daily-temp-max-${index}`}>
                    {displayTempMax}°
                  </span>
                  <span className="text-muted-foreground ml-2" data-testid={`text-daily-temp-min-${index}`}>
                    {displayTempMin}°
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
