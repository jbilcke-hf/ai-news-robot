import fs from "node:fs"

import dotenv from "dotenv"

dotenv.config()

try {
  if (fs.existsSync(".env.local")) {
    const result = dotenv.config({ path: ".env.local" })
    console.log("using .env.local")
    process.env = {
      ...process.env,
      ...result.parsed,
    }
  }
} catch (err) {
  // do nothing
  console.log("using .env")
}

export const hfUsername = `${process.env.AI_NEWS_ROBOT_HUGGINGFACE_USERNAME || ""}`
export const hfDailyNewsDataset = `${process.env.AI_NEWS_ROBOT_DAILY_NEWS_DATASET || ""}`
export const hfDailyPapersDataset = `${process.env.AI_NEWS_ROBOT_DAILY_PAPERS_DATASET || ""}`
export const hfDailyWeatherDataset = `${process.env.AI_NEWS_ROBOT_DAILY_WEATHER_DATASET || ""}`

export const hfApiKey = `${process.env.AI_NEWS_ROBOT_HUGGINGFACE_API_KEY || ""}`
export const hfInferenceApiModel = `${process.env.AI_NEWS_ROBOT_HUGGINGFACE_INFERENCE_API_MODEL || ""}`

export const newsdataApiKey = `${process.env.AI_NEWS_ROBOT_NEWSDATA_API_KEY || ""}`
export const weatherapiApiKey = `${process.env.AI_NEWS_ROBOT_WEATHERAPI_API_KEY || ""}`