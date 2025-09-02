import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CloudSun, AlertCircle } from 'lucide-react';
import { SearchBar } from '@/components/weather/search-bar';
import { CurrentWeather } from '@/components/weather/current-weather';
import { HourlyForecast } from '@/components/weather/hourly-forecast';
import { WeeklyForecast } from '@/components/weather/weekly-forecast';
import { WeatherDetails } from '@/components/weather/weather-details';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { WeatherData } from '@shared/schema';

export default function Weather() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const { toast } = useToast();

  // Try to get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to a default location (San Francisco)
          setCoordinates({ lat: 37.7749, lon: -122.4194 });
          toast({
            title: "Location access denied",
            description: "Using default location. You can search for your city above.",
            variant: "default",
          });
        }
      );
    } else {
      // Fallback if geolocation is not supported
      setCoordinates({ lat: 37.7749, lon: -122.4194 });
      toast({
        title: "Geolocation not supported",
        description: "Using default location. You can search for your city above.",
        variant: "default",
      });
    }
  }, [toast]);

  const {
    data: weatherData,
    isLoading,
    error,
    refetch,
  } = useQuery<WeatherData>({
    queryKey: ['/api/weather', coordinates?.lat, coordinates?.lon],
    enabled: !!coordinates,
  });

  const handleLocationSelect = (lat: number, lon: number) => {
    setCoordinates({ lat, lon });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          toast({
            title: "Location updated",
            description: "Weather data updated for your current location.",
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location error",
            description: "Unable to get your current location. Please try again.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(unit => unit === 'C' ? 'F' : 'C');
  };

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <header className="glass-effect border-b border-border/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CloudSun className="text-2xl text-primary w-8 h-8" />
                <h1 className="text-xl font-bold text-foreground">WeatherNow</h1>
              </div>
              <SearchBar
                onLocationSelect={handleLocationSelect}
                onCurrentLocation={handleCurrentLocation}
              />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <h1 className="text-2xl font-bold text-foreground">Weather Data Unavailable</h1>
              </div>
              <p className="mt-4 text-sm text-muted-foreground mb-6">
                Unable to fetch weather data. Please check your internet connection and try again.
              </p>
              <div className="flex space-x-3">
                <Button onClick={handleRetry} className="flex-1" data-testid="button-retry">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="glass-effect border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CloudSun className="text-2xl text-primary w-8 h-8" />
              <h1 className="text-xl font-bold text-foreground">WeatherNow</h1>
            </div>
            <SearchBar
              onLocationSelect={handleLocationSelect}
              onCurrentLocation={handleCurrentLocation}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {isLoading ? (
          // Loading state
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-48 loading-skeleton"></div>
              <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="flex space-x-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-20 flex-shrink-0" />
                ))}
              </div>
            </Card>
          </div>
        ) : weatherData ? (
          <>
            <CurrentWeather
              data={weatherData}
              temperatureUnit={temperatureUnit}
              onToggleUnit={toggleTemperatureUnit}
            />
            <HourlyForecast data={weatherData} temperatureUnit={temperatureUnit} />
            <WeeklyForecast data={weatherData} temperatureUnit={temperatureUnit} />
            <WeatherDetails data={weatherData} />
          </>
        ) : null}
      </main>
    </div>
  );
}
