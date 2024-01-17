import YAML from "yaml"

import { summarizeWithZephyr } from "../summarizeWithZephyr.mts"
import { getDailyPapers } from "./getDailyPapers.mts"
import { sleep } from "../sleep.mts"
import { uploadMarkdownPrompt } from "../uploadMarkdownPrompt.mts"
import { hfDailyPapersDataset } from "../config.mts"

export const checkDailyPapers = async () => {
  console.log("- checking Hugging Face Daily Papers API..")

  let news: any[] = []
  
  let nbMaxPapers = 4

  const dailyPapers = await getDailyPapers()
  // const data = sampleDataFreePlan

  console.log(`- parsing the top ${nbMaxPapers} papers..`)

  // most upvotes first
  const papersByUpvotes =
    dailyPapers.sort((a, b) => b.paper.upvotes - a.paper.upvotes)

  const topNthPapers = papersByUpvotes.slice(0, nbMaxPapers)

  topNthPapers.forEach(({
    paper: {
      id, // string
      authors, // Author[]
      publishedAt, // string
      title, // string
      summary, // string
      upvotes, // number
    },
    // publishedAt, // string
    // title, // string
    // mediaUrl, // string
    // numComments, // number
  }) => {
    news.push({
      title,
      summary,

      // sorry we have to put a limit here
      authors: authors.slice(0, 4).map(a => a.name)
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

Daily Papers ${today} 🔥

# Description

A summary of recent scientific papers in the domain of AI

# Prompt

You are a TV channel agent, your channel is about science and AI.
Your mission is to summarize scientific papers (which will be given to you as YAML) into a compact, dense report suitable for people who are not familiar with AI.
You can use complex AI and scientific vocabulary, but then you will have to explain the words.
Please limit yourself to about 20 paragraphs.

Here is the summary of today's scientific papers:

article:
${summaries.join("\n\narticle:")}
`
  console.log("final markdown:", markdown)

  console.log("Uploading daily paper prompt to Hugging Face..")

  await uploadMarkdownPrompt({ markdown, dataset: hfDailyPapersDataset })
}
