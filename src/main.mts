import YAML from "yaml"

import { sampleDataFreePlan } from "./sampleDataFreePlan.mts"
import { getNews } from "./getNews.mts"

export const main = async () => {

  let delayInSeconds = 15 * 60 // let's check every 5 minutes
  console.log(`-------------- ${delayInSeconds} sec have elapsed --------------`)
  console.log("- checking NewsData.io API..")


  let newsItems: any[] = []
  
  // const data = await getNews()
  const data = sampleDataFreePlan

  const interestingNews = data.results.filter(news =>
    news.language === "english" &&
    news.country.includes("united states of america")
  )

  interestingNews.forEach(({
    article_id, // string
    title, // string
    link, // string
    keywords, // string[]
    creator, // string[]
    video_url, // any
    description, // string
    content, // string
    pubDate, // string
    image_url, // ?: string
    source_id, // string
    source_priority, // number
    country, // string[]
    category, // string[]
    language, // string
    ai_tag, // string[]
    sentiment, // string
    sentiment_stats // SentimentStats
  }) => {

    console.log("language:", language)
    newsItems.push({
      title,
      data: pubDate,
      countries: country,
      categories: category,
      content,
    })
  })

  const newsPrompt = YAML.stringify(newsItems)
  console.log("news:", newsPrompt)
  console.log("")

  // loop every hour
  setTimeout(() => {
    main()
  }, delayInSeconds * 1000)
}
