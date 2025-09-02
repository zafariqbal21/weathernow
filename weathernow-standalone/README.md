# WeatherNow - Standalone Weather App

A beautiful, responsive weather application that shows current conditions, forecasts, and air quality data.

**Developed by ZIQ**

## 🚀 Quick Start

### 1. Get a Free API Key
1. Go to [WeatherAPI.com](https://www.weatherapi.com/)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Install and Run
```bash
# Install dependencies
npm install

# Set your API key (replace with your actual key)
export VITE_OPENWEATHER_API_KEY="your_api_key_here"

# Start the app
npm run dev
```

The app will open at http://localhost:5000

### 3. For Windows Users
Create a `.env` file in the project folder and add:
```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

Then run:
```bash
npm install
npm run dev
```

## 📦 Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## ✨ Features

- 🌤️ **Current Weather** - Temperature, humidity, wind speed, UV index
- 📊 **24-Hour Forecast** - Hourly temperature and precipitation
- 📅 **5-Day Forecast** - Daily temperature ranges and conditions  
- 🌬️ **Air Quality** - AQI, PM2.5, PM10, and ozone levels
- 🌅 **Sun & Moon** - Sunrise, sunset times and moon phases
- 🔍 **Location Search** - Find weather for any city worldwide
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🎨 **Modern UI** - Clean, beautiful interface with smooth animations

## 🌐 Deployment

Deploy to any static hosting service:

- **Vercel**: Connect GitHub repo, set `VITE_OPENWEATHER_API_KEY` env var
- **Netlify**: Build command: `npm run build`, publish directory: `dist`
- **GitHub Pages**: Deploy the `dist` folder after building

## 🛠️ Technical Details

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful components
- **WeatherAPI.com** for weather data
- **React Query** for data fetching

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Need help?** Create an issue or check the documentation at WeatherAPI.com