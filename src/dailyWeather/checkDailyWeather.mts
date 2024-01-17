import YAML from "yaml"

import { summarizeWithZephyr } from "../summarizeWithZephyr.mts"
import { getDailyWeather } from "./getDailyWeather.mts"
import { sleep } from "../sleep.mts"
import { uploadMarkdownPrompt } from "../uploadMarkdownPrompt.mts"
import { hfDailyWeatherDataset } from "../config.mts"

export const checkDailyWeather = async () => {
  console.log("- checking Weather API current/realtime weather..")

  let news: any[] = []

  const cities: string[] = [
    "New York, US",
    "San Francisco, US",
    "Miami, Florida",
    "London, UK",
    "Paris, France"
  ]

  console.log(`- parsing the weather..`)

  for (const city of cities) {
    await sleep(2000)
    const {
      current: {
        // note: there are a lot of other fields,
        // and other units like miles or fahrenheit!
        // go to -> https://www.weatherapi.com/docs/
        temp_c,
        feelslike_c,
        condition,
        wind_kph,
        pressure_mb,
        precip_mm,
        humidity,
        cloud,
        is_day,
        gust_kph,
        air_quality,
      }
    } = await getDailyWeather({ city })
    
    const airQualityIndex = air_quality?.["us-epa-index"] || 0
    const airQualityMessage = {
      0: "",
      1: "Good",
      2: "Moderate",
      3: "Unhealthy for sensitive group",
      4: "Unhealthy",
      5: "Very Unhealthy",
      6: "Hazardous",
    }[airQualityIndex] || ""

    news.push({
      "City name": city,
      "Temperature (°C)": temp_c,
      "Feels like (°C)": feelslike_c,
      "Weather condition": condition.text,
      "Wind speed (km/h)": wind_kph,
      "Pressure (millibars)": pressure_mb,
      "Precipitation amount (mm)": precip_mm,
      "Humidity (%)": humidity,
      "Cloud cover (%)": cloud,
      "Day/night time": is_day === 1 ? "Day time" : "Night time",
      "Wind gust speed (km/h)": gust_kph,
      ...airQualityMessage ? { "Air quality": airQualityMessage } : undefined,
      /*
      "Air quality": air_quality ? {
        "US - EPA standard": ({
          1: "Good",
          2: "Moderate",
          3: "Unhealthy for sensitive group",
          4: "Unhealthy",
          5: "Very Unhealthy",
          6: "Hazardous",
        })[`${air_quality["us-epa-index"]}`] || "N.A.",
        "Carbon Monoxide (μg/m3)": air_quality.co || "N.A.",
        "Ozone (μg/m3)": air_quality.o3 || "N.A.",
        "Nitrogen dioxide (μg/m3)": air_quality.no2 || "N.A.",
        "Sulphur dioxide (μg/m3)": air_quality.so2 || "N.A.",
        "PM2.5 (μg/m3)": air_quality.pm2_5 || "N.A.",
        "PM10 (μg/m3)": air_quality.pm10 || "N.A."
      } : "Not available",
      */
    })
  }

  console.log("news:", news)
  // const data = sampleDataFreePlan

  const summaries: string[] = []
  for (const item of news) {
    console.log("- generating summary..")

    const summary = await summarizeWithZephyr({
      news: YAML.stringify(item) 
    })
    console.log(" -> summary: " + summary)
    if (summary) {
      summaries.push(`City data for ${item["City name"] || "city"}: ${summary}`)
      await sleep(1000)
    } else {
      console.log("(!) got no data!")
      await sleep(5000)
    }
  }

  const today = new Date().toLocaleDateString('en-us', {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) 
  // "Friday, Jul 2, 2021"

  const markdown = `
# Title

Daily Weather ${today} ☀️☁️

# Description

A weather report of various cities

# Prompt

You are a TV channel agent groundhog called Nimbles, your channel is about weather.
Your mission is to summarize weather data for various cities (which will be given to you as YAML) into a compact, dense report suitable for a short TV infocast.
Please limit yourself to about 20 paragraphs.
Please make the report less boring: your presentation should be entertaining!
Don't joke too much about air quality if you have the data (this part is serious matter), but for the rest you can make jokes, puns, recommendations about what to do during the day based on the weather etc.
Finish each city weather report with a silly joke or remark about the weather.

Note: everything is the current real-time weather data (it's not a forecast).

${summaries.join("\n\n")}
`
  console.log("final markdown:", markdown)

  console.log("Uploading daily weather prompt to Hugging Face..")

  await uploadMarkdownPrompt({ markdown, dataset: hfDailyWeatherDataset })
}
