# Installation Guide - WeatherNow

## Step 1: Download and Extract

1. Download the `weathernow-standalone.tar.gz` file
2. Extract it:
   - **Windows**: Use 7-Zip, WinRAR, or built-in extraction
   - **Mac**: Double-click the file or use `tar -xzf weathernow-standalone.tar.gz`
   - **Linux**: Run `tar -xzf weathernow-standalone.tar.gz`

## Step 2: Get WeatherAPI Key

1. Go to https://www.weatherapi.com/
2. Click "Sign Up Free"
3. Create your account (completely free)
4. Go to your dashboard and copy your API key

## Step 3: Install Node.js (if not installed)

Download and install Node.js from https://nodejs.org/ (choose LTS version)

## Step 4: Set Up the App

### Option A: Using Environment Variable (Mac/Linux)
```bash
cd weathernow-standalone
npm install
export VITE_OPENWEATHER_API_KEY="your_api_key_here"
npm run dev
```

### Option B: Using .env file (Windows/Mac/Linux)
```bash
cd weathernow-standalone
npm install
echo 'VITE_OPENWEATHER_API_KEY=your_api_key_here' > .env
npm run dev
```

### Option C: Windows Command Prompt
```cmd
cd weathernow-standalone
npm install
set VITE_OPENWEATHER_API_KEY=your_api_key_here
npm run dev
```

## Step 5: Open the App

The app will start at http://localhost:5000

## Building for Production

```bash
npm run build
npm run preview
```

## Troubleshooting

- **"npm: command not found"** → Install Node.js
- **"API key not found"** → Check your .env file or environment variable
- **"Permission denied"** → On Mac/Linux, try `sudo npm install`
- **Port 5000 busy** → The app will automatically use another port

## Need Help?

- Check that Node.js is installed: `node --version`
- Verify npm is working: `npm --version`
- Make sure your API key is correct (32 characters)
- Try clearing npm cache: `npm cache clean --force`