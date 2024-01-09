import { newsdataApiKey } from "./config.mts"
import { ApiResponse } from "./types.mts"

export async function getNews(): Promise<ApiResponse> {

  const q = [
    "ai",
    "artificial intelligence",
    "openai",
    "huggingface",
    "hugging face",
    "stable diffusion",
    "ai ethics",
    "tesla optimus",
    "Optimus Gen2",
    "sdxl",
    "gaussian splatting",
    "latent space",
    "gpu",
    "nvidia",
    "spatial computing",
    "apple vision pro"
  ].join(" OR ")

  const country = [
    "us"
  ].join(",")

  const language = [
    "en"
  ].join(",")

  const category = [
    "technology",
    "business",
    "science"
  ].join(",")

  const res = await fetch(
    `https://newsdata.io/api/1/news?apikey=${
      newsdataApiKey
    }&country=${
      country
    }&language=${
      language
    }&category=${
      category
    }&q=${
      q
    }`
  )

  const json = (await res.json()) as ApiResponse

  return json

}