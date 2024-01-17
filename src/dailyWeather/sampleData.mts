import { DailyWeatherApiResponse } from "./types.mts"

// https://api.weatherapi.com/v1/current.json?key=<SECRET>&q=San Francisco&aqi=yes
export const sampleDailyWeatherCurrent: DailyWeatherApiResponse = {
  "location": {
      "name": "San Francisco",
      "region": "California",
      "country": "United States of America",
      "lat": 37.78,
      "lon": -122.42,
      "tz_id": "America/Los_Angeles",
      "localtime_epoch": 1705489485,
      "localtime": "2024-01-17 3:04"
  },
  "current": {
      "last_updated_epoch": 1705489200,
      "last_updated": "2024-01-17 03:00",
      "temp_c": 12.8,
      "temp_f": 55.0,
      "is_day": 0,
      "condition": {
          "text": "Partly cloudy",
          "icon": "//cdn.weatherapi.com/weather/64x64/night/116.png",
          "code": 1003
      },
      "wind_mph": 8.1,
      "wind_kph": 13.0,
      "wind_degree": 260,
      "wind_dir": "W",
      "pressure_mb": 1016.0,
      "pressure_in": 29.99,
      "precip_mm": 0.01,
      "precip_in": 0.0,
      "humidity": 89,
      "cloud": 75,
      "feelslike_c": 12.7,
      "feelslike_f": 54.8,
      "vis_km": 16.0,
      "vis_miles": 9.0,
      "uv": 1.0,
      "gust_mph": 12.5,
      "gust_kph": 20.2,
      "air_quality": {
          "co": 217.0,
          "no2": 1.1,
          "o3": 74.4,
          "so2": 0.2,
          "pm2_5": 2.1,
          "pm10": 2.6,
          "us-epa-index": 1,
          "gb-defra-index": 1
      }
  }
}