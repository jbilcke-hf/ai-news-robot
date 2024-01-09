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

export const hfUsername = `${process.env.AI_NEWS_HUGGINGFACE_USERNAME || ""}`
export const hfDataset = `${process.env.AI_NEWS_HUGGINGFACE_DATASET || ""}`

export const hfApiKey = `${process.env.AI_NEWS_HUGGINGFACE_API_KEY || ""}`
export const hfInferenceApiModel = `${process.env.AI_NEWS_HUGGINGFACE_INFERENCE_API_MODEL || ""}`

export const newsdataApiKey = `${process.env.AI_NEWS_NEWSDATA_API_KEY || ""}`