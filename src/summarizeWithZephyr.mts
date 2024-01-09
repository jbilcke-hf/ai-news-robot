import { HfInference } from "@huggingface/inference"

import { createZephyrPrompt } from "./createZephyrPrompt.mts"
import { hfInferenceApiModel, hfApiKey } from "./config.mts"


const hf = new HfInference(hfApiKey)

export async function summarizeWithZephyr({
  news,
  neverThrow
}: {
  news: string
  neverThrow?: boolean
}): Promise<string> {
  try {
    const inputs = createZephyrPrompt([
      {
        role: "system",
        content: `Your must summarize the content into 2 or 3 sentence. DO NOT write more than than. Keep it dense and simple, and short.`,
      },
      {
        role: "user",
        content: news,
      }
    ]) //+ "\n["

    const nbMaxNewTokens = 250

    let rawBufferString = ""
    try {
      for await (const output of hf.textGenerationStream({
        model: hfInferenceApiModel,
        inputs,
        parameters: {
          do_sample: true,
          max_new_tokens: nbMaxNewTokens,
          return_full_text: false,
        }
      })) {
        rawBufferString += output.token.text
        // process.stdout.write(output.token.text)
        if (
          rawBufferString.includes("</s>") || 
          rawBufferString.includes("<s>") ||
          rawBufferString.includes("/s>") ||
          rawBufferString.includes("[INST]") ||
          rawBufferString.includes("[/INST]") ||
          rawBufferString.includes("<SYS>") ||
          rawBufferString.includes("<<SYS>>") ||
          rawBufferString.includes("</SYS>") ||
          rawBufferString.includes("<</SYS>>") ||
          rawBufferString.includes("<|user|>") ||
          rawBufferString.includes("<|end|>") ||
          rawBufferString.includes("<|system|>") ||
          rawBufferString.includes("<|assistant|>")
        ) {
          break
        }
      }
    } catch (err) {
      // console.error(`error during generation: ${err}`)

      if (`${err}` === "Error: Model is overloaded") {
        rawBufferString = ``
      }
    }

    const tmpResult = 
      rawBufferString.replaceAll("</s>", "") 
      .replaceAll("<s>", "")
      .replaceAll("/s>", "")
      .replaceAll("[INST]", "")
      .replaceAll("[/INST]", "")
      .replaceAll("<SYS>", "")
      .replaceAll("<<SYS>>", "")
      .replaceAll("</SYS>", "")
      .replaceAll("<</SYS>>", "")
      .replaceAll("<|user|>", "")
      .replaceAll("<|end|>", "")
      .replaceAll("<|system|>", "")
      .replaceAll("<|assistant|>", "")
    
  
    return tmpResult
  } catch (err) {
    if (neverThrow) {
      console.error(`summarizeWithZephyr():`, err)
      return ""
    } else {
      throw err
    }
  }
}