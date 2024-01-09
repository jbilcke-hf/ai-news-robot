import YAML from "yaml"

import { sampleDataFreePlan } from "./sampleDataFreePlan.mts"
import { getNews } from "./getNews.mts"
import { summarizeWithZephyr } from "./summarizeWithZephyr.mts"
import { sleep } from "./sleep.mts"

export const main = async () => {
  // console.log(JSON.stringify(await getNews(), null, 2))

  let delayInSeconds = 15 * 60

  console.log(`-------------- ${delayInSeconds} sec have elapsed --------------`)
  console.log("- checking NewsData.io API..")


  let news: any[] = []
  
  let nbMaxNews = 5

  // const data = await getNews()
  const data = sampleDataFreePlan

  const interestingNews = data.results.filter(news =>
    news.language === "english" &&
    news.country.includes("united states of america")
  ).slice(0, nbMaxNews)

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
    news.push({
      title,
      data: pubDate,
      countries: country,
      categories: category,
      content,
    })
  })

  const summaries: string[] = []
  for (const item of news) {
    console.log("- generating summary..")

    const summary = await summarizeWithZephyr({
      news: YAML.stringify(item) 
    })
    console.log(" -> summary: " + summary)
    if (summary) {
      summaries.push(summary)
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

News Report ${today} 🔥

# Description

A summary of what happened today in the world of tech and AI

# Prompt

You are a TV news channel agent.
Your mission is to summarize news (which will be given to you as YAML) into a compact, dense news report suitable for a news anchor.
Please limit yourself to about 20 paragraphs.

Here is the summary of today's news:

article:
${summaries.join("\n\narticle:")}
`

  console.log("final markdown:", markdown)




  // TODO: generate a markdow file and upload it to Hugging Face

  setTimeout(() => {
    main()
  }, delayInSeconds * 1000)
}
