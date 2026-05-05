/**
 * Weather Service
 * Optimized for Open-Meteo (Professional Open Source Weather API)
 * No API key required. High accuracy for agricultural metrics.
 */

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export const weatherService = {
    /**
     * Fetch weather by city name (e.g., "Colombo")
     * Leverages Open-Meteo Geocoding API + Forecast API
     */
    async getWeatherByCity(city = "Colombo") {
        try {
            // Step 1: Geocode city to coords
            const geoRes = await fetch(`${GEO_URL}?name=${city}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) throw new Error("City not found");

            const { latitude, longitude, name } = geoData.results[0];
            return this.getWeatherByCoords(latitude, longitude, name);
        } catch (error) {
            console.error("City weather fetch failed:", error);
            return null;
        }
    },

    /**
     * Fetch weather by coordinates
     */
    async getWeatherByCoords(lat, lon, cityName = "Your Location") {
        try {
            const params = new URLSearchParams({
                latitude: lat,
                longitude: lon,
                current: "temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,cloud_cover,pressure_msl,wind_speed_10m",
                timezone: "auto",
                forecast_days: 1
            });

            const response = await fetch(`${WEATHER_URL}?${params.toString()}`);
            if (!response.ok) throw new Error("Weather API unreachable");

            const data = await response.json();
            const current = data.current;

            return {
                temp: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                pressure: current.pressure_msl,
                windSpeed: current.wind_speed_10m,
                clouds: current.cloud_cover,
                rainfall: current.rain || current.precipitation || 0,
                condition: this._interpretWeatherCode(current.weather_code),
                city: cityName,
                timestamp: Date.now(),
            };
        } catch (error) {
            console.error("Coords weather fetch failed:", error);
            return null;
        }
    },

    /**
     * Browser Geolocation Helper
     */
    async getUserLocation() {
        return new Promise((resolve) => {
            if (!navigator || !navigator.geolocation) return resolve(null);
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                () => resolve(null),
                { timeout: 7000 }
            );
        });
    },

    /**
     * Maps WMO Weather Codes to Human Readable strings
     */
    _interpretWeatherCode(code) {
        if (code === 0) return "Clear Sky";
        if (code >= 1 && code <= 3) return "Mainly Clear / Part Cloudy";
        if (code >= 45 && code <= 48) return "Foggy";
        if (code >= 51 && code <= 67) return "Rainy / Drizzle";
        if (code >= 71 && code <= 77) return "Snowy";
        if (code >= 80 && code <= 82) return "Rain Showers";
        if (code >= 95) return "Thunderstorm";
        return "Clouds";
    }
};
