import { Blob } from "buffer"

import { v4 as uuidv4 } from "uuid"
import { uploadFile } from "@huggingface/hub"

import { hfApiKey, hfUsername } from "./config.mts"

export async function uploadMarkdownPrompt({
  markdown,
  dataset,
}: {
  markdown: string
  dataset: string
}): Promise<string> {
  if (!markdown) {
    throw new Error(`the markdown cannot be empty`)
  }

  const credentials = { accessToken: hfApiKey }
  
  // Convert base64 string a Buffer
  const blob = new Blob([markdown])

  const id = uuidv4()
  const uploadFilePath = `prompt_${id}.md`

  await uploadFile({
	  credentials,
    repo: `datasets/${hfUsername}/${dataset}`,
    file: {
      path: uploadFilePath,
      content: blob as any,
    },
    commitTitle: `[robot] Upload markdown prompt ${id}`,
  })

  console.log(`successfully uploaded the file to ${hfUsername}/${dataset}`)
  
  return `https://huggingface.co/datasets/${hfUsername}/${dataset}/resolve/main/${uploadFilePath}`
}
