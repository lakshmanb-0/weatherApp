# Weather Forecast Web Application
<img src= 'https://i.postimg.cc/y6Qcq7Xn/879shots-so.png' />

This project consists of a web application that displays weather forecasts and city data using Nextjs, TypeScript, and Redux. The primary features include a searchable and sortable table of cities, along with detailed weather information for each selected city.

# Description

The application allows users to explore a vast list of cities and access up-to-date weather forecasts. Users can interact with a dynamically populated table of cities with infinite scroll capabilities, leveraging a public API for city data.[limit is 100 entries] By selecting a city, users can view current weather conditions and forecasts provided by the OpenWeatherMap API.

# Core Features

- Display a table listing cities with infinite scroll
- Search-as-you-type with autocomplete suggestions.
- Filter and sorting options for each column.
- Track history of viewed locations and manage favorite locations for quick access.
- Allow users to switch between measurement units (Celsius/Fahrenheit, metric/imperial).

# APIs Used

- Cities Data: Open Public API
- Weather Data: OpenWeatherMap API (requires API key registration)

# Env File

```bash
NEXT_WEATHER_APP_KEY="YOUR_OPENWEATHERMAP_API_KEY"
```

# Cloning the Repository

To clone this repository, run the following command in your terminal:

```bash
git clone https://github.com/lakshmanb-0/weatherApp.git
```

Usage
Provide instructions on how to use the project after cloning:

```bash
cd weatherApp
npm install
npm run dev
```
