export type DailyNewsApiResponse = {
  status: string
  totalResults: number
  results: DailyNewsApiResult[]
  nextPage: string
}

export type DailyNewsApiResult = {
  article_id: string
  title: string
  link: string
  keywords?: string[]
  creator?: string[]
  video_url: any
  description?: string
  content: string
  pubDate: string
  image_url?: string
  source_id: string
  source_priority: number
  country: string[]
  category: string[]
  language: string

  // note: this is only available in PRO plans

  // ai_tag: string[]
  // sentiment: string
  // sentiment_stats: DailyNewsSentimentStats

  // what we get in a free plan is this:
  // "ai_tag": "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLAN",
  // "sentiment": "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLAN",
  // "sentiment_stats": "ONLY AVAILABLE IN PROFESSIONAL AND CORPORATE PLAN"
  ai_tag: string
  sentiment: string
  sentiment_stats: string
}

export type DailyNewsSentimentStats = {
  positive: number
  neutral: number
  negative: number
}

