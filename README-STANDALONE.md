# WeatherNow - Standalone React App

A standalone weather application built with React and WeatherAPI.com, ready for static deployment.

## Features

- 🌤️ Real-time weather data from WeatherAPI.com
- 📊 Current conditions, hourly and 5-day forecasts
- 🌬️ Air quality information
- 🌅 Sunrise/sunset and moon phase data
- 🔍 Location search with autocomplete
- 📱 Responsive design for mobile and desktop
- 🎨 Modern UI with shadcn/ui components

## Quick Start

1. Set your WeatherAPI.com API key:
   ```bash
   export VITE_OPENWEATHER_API_KEY="your_api_key_here"
   ```

2. Development:
   ```bash
   vite --config vite-standalone.config.ts --port 5000 --host 0.0.0.0
   ```

3. Production build:
   ```bash
   vite build --config vite-standalone.config.ts
   ```

4. Preview production build:
   ```bash
   vite preview --config vite-standalone.config.ts
   ```

## Deployment

The app can be deployed to any static hosting service:

### Vercel
1. Connect your GitHub repository
2. Set environment variable: `VITE_OPENWEATHER_API_KEY`
3. Deploy

### Netlify
1. Connect your GitHub repository  
2. Build command: `vite build --config vite-standalone.config.ts`
3. Publish directory: `dist`
4. Environment variable: `VITE_OPENWEATHER_API_KEY`

### GitHub Pages
1. Build the app: `npm run build`
2. Deploy the `dist` folder to gh-pages branch

## Environment Variables

- `VITE_OPENWEATHER_API_KEY` - Your WeatherAPI.com API key (required)

## API

The app uses WeatherAPI.com for weather data:
- Current weather conditions
- 24-hour hourly forecast  
- 5-day daily forecast
- Air quality data
- Location search and geocoding

## Credits

Developed by ZIQ