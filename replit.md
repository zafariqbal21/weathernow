# Overview

This is a weather application built with React and Express that provides comprehensive weather information including current conditions, hourly forecasts, 5-day forecasts, air quality data, and sun/moon information. The application features a modern UI built with shadcn/ui components and integrates with the OpenWeatherMap API to fetch real-time weather data.

The app allows users to search for locations, view detailed weather information, and toggle between Celsius and Fahrenheit temperature units. It includes responsive design with mobile support and automatic geolocation detection for user convenience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Icons**: Lucide React icons with FontAwesome fallbacks for weather icons

## Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with endpoints for weather data and location search
- **Development**: Hot module replacement with Vite middleware in development
- **Production**: Static file serving with Express in production

## Data Layer
- **Database**: PostgreSQL with Drizzle ORM for type-safe database interactions
- **Database Provider**: Neon serverless PostgreSQL
- **Schema**: Shared TypeScript schemas using Zod for validation
- **Storage**: No persistent weather data storage - all data fetched from external APIs

## External Dependencies
- **Weather API**: OpenWeatherMap API for current weather, forecasts, and air quality data
- **Geolocation**: Browser Geolocation API for automatic location detection
- **Database**: Neon PostgreSQL for potential future data persistence
- **Build Tools**: Vite for frontend bundling, ESBuild for backend bundling
- **Development Tools**: Replit-specific plugins for development environment integration

## Key Design Patterns
- **Monorepo Structure**: Shared schemas and types between frontend and backend
- **Component Composition**: Modular weather components (CurrentWeather, HourlyForecast, etc.)
- **API-First**: Weather data fetched from external APIs with no local caching
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Error Handling**: Graceful fallbacks for API failures and location errors
- **Type Safety**: End-to-end TypeScript with strict type checking

## Authentication & Security
- No authentication system currently implemented
- API keys managed through environment variables
- CORS and basic security headers configured

## Performance Optimizations
- React Query for intelligent data fetching and caching
- Debounced search for location autocomplete
- Lazy loading and code splitting with Vite
- Optimized bundle sizes with tree shaking