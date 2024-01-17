import YAML from "yaml"

import { summarizeWithZephyr } from "../summarizeWithZephyr.mts"
import { getDailyNews } from "./getDailyNews.mts"
import { sleep } from "../sleep.mts"
import { uploadMarkdownPrompt } from "../uploadMarkdownPrompt.mts"
import { hfDailyNewsDataset } from "../config.mts"

export const checkDailyNews = async () => {
  console.log("- checking NewsData.io API..")

  let news: any[] = []
  
  let nbMaxNews = 5

  const dailyNews = await getDailyNews()
  // const data = sampleDataFreePlan

  console.log("- parsing the top 5 news..")

  const interestingDailyNews = dailyNews.results.filter(news =>
    news.language === "english" &&
    news.country.includes("united states of america")
  ).slice(0, nbMaxNews)

  interestingDailyNews.forEach(({
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
      date: pubDate,
      countries: country,
      categories: category,
      source: source_id,
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
Sometimes, the same news is reported by different medias/articles: if that happens, do not tell the story twice!! You need to synthetize the information from those various sources!
Please limit yourself to about 20 paragraphs.

Here is the summary of today's news:

article:
${summaries.join("\n\narticle:")}
`
  console.log("final markdown:", markdown)

  console.log("Uploading daily news prompt to Hugging Face..")

  await uploadMarkdownPrompt({ markdown, dataset: hfDailyNewsDataset })
}
