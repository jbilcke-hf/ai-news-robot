
import { DailyPapersApiResponse } from "./types.mts"

export async function getDailyPapers(): Promise<DailyPapersApiResponse> {

  const res = await fetch(`https://hf.co/api/daily_papers`)

  const articles = (await res.json()) as DailyPapersApiResponse

  return articles
}