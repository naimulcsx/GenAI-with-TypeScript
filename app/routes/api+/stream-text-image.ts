import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import type { ActionFunctionArgs } from "react-router";
import { type FileUpload, parseFormData } from "@mjackson/form-data-parser";

const model = anthropic("claude-3-5-sonnet-latest");

const schema = z.object({
  prompt: z.string(),
  markdown: z.boolean().optional(),
});

export async function loader() {
  throw new Response("Method not allowed", {
    status: 405,
    statusText: "Method Not Allowed",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await parseFormData(request);

  const prompt = formData.get("prompt") as string;
  const image = formData.get("image") as FileUpload;

  const imageBuffer = await image.arrayBuffer();

  const { success, data } = schema.safeParse({ prompt });

  if (!success) {
    return new Response("Missing prompt", { status: 400 });
  }

  const markdown = data.markdown;

  let finalPrompt = prompt;
  if (markdown) {
    finalPrompt = `Please format your response in markdown. ${prompt}`;
  }

  const result = streamText({
    model,
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: [
          {
            type: "image",
            image: imageBuffer,
          },
        ],
      },
    ],
  });

  const stream = result.toDataStream();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
