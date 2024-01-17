
import { weatherapiApiKey } from "../config.mts"
import { sleep } from "../sleep.mts"
import { DailyWeatherApiResponse } from "./types.mts"

export async function getDailyWeather({
  city
}: {
  city?: string
}): Promise<DailyWeatherApiResponse> {
  const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${
    weatherapiApiKey
  }&q=${encodeURIComponent(
    city
  )}&aqi=yes`)

  const data = (await res.json()) as DailyWeatherApiResponse

  return data
}