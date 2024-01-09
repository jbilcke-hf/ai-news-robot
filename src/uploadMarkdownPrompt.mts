import { Blob } from "buffer"

import { v4 as uuidv4 } from "uuid"
import { uploadFile } from "@huggingface/hub"

import { hfApiKey, hfDataset, hfUsername } from "./config.mts"

export async function uploadMarkdownPrompt({
  markdown,
}: {
  markdown: string
}): Promise<string> {
  if (!markdown) {
    throw new Error(`the markdown cannot be empty`)
  }

  const credentials = { accessToken: hfApiKey }
  
  // Convert base64 string a Buffer
  const blob = new Blob([JSON.stringify(markdown, null, 2)])

  const id = uuidv4()
  const uploadFilePath = `prompt_${id}.md`

  await uploadFile({
	  credentials,
    repo: `datasets/${hfUsername}/${hfDataset}`,
    file: {
      path: uploadFilePath,
      content: blob as any,
    },
    commitTitle: `[robot] Upload markdown prompt ${id}`,
  })

  return `https://huggingface.co/datasets/${hfUsername}/${hfDataset}/resolve/main/${uploadFilePath}`
}
