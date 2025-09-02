import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface Location {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number) => void;
  onCurrentLocation: () => void;
}

export function SearchBar({ onLocationSelect, onCurrentLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: locations, isLoading } = useQuery({
    queryKey: ['/api/locations', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const response = await fetch(`/api/locations?q=${encodeURIComponent(debouncedQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      return response.json() as Promise<Location[]>;
    },
    enabled: debouncedQuery.length > 2,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location: Location) => {
    setQuery(`${location.name}, ${location.country}`);
    setShowSuggestions(false);
    onLocationSelect(location.lat, location.lon);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(true);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onCurrentLocation();
          onLocationSelect(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div ref={searchRef} className="relative hidden sm:block">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-64 pl-10"
            data-testid="input-search-city"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </div>

        {showSuggestions && (debouncedQuery.length > 2) && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-muted-foreground">
                Searching...
              </div>
            ) : locations && locations.length > 0 ? (
              locations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left p-3 hover:bg-muted transition-colors text-sm"
                  data-testid={`button-location-${index}`}
                >
                  <div className="font-medium">
                    {location.name}
                    {location.state && `, ${location.state}`}
                  </div>
                  <div className="text-muted-foreground">
                    {location.country}
                  </div>
                </button>
              ))
            ) : debouncedQuery.length > 2 ? (
              <div className="p-3 text-sm text-muted-foreground">
                No locations found
              </div>
            ) : null}
          </div>
        )}
      </div>

      <Button
        onClick={handleCurrentLocation}
        variant="ghost"
        size="icon"
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        data-testid="button-current-location"
      >
        <MapPin className="w-4 h-4" />
      </Button>

      {/* Mobile Search */}
      <div className="sm:hidden flex-1">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-10"
            data-testid="input-search-city-mobile"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
