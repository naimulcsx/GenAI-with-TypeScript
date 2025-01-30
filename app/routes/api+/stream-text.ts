import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import type { ActionFunctionArgs } from "react-router";

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
  const body = await request.json();

  const { success, data } = schema.safeParse(body);

  if (!success) {
    return new Response("Missing prompt", { status: 400 });
  }

  const prompt = data.prompt;
  const markdown = data.markdown;

  let finalPrompt = prompt;
  if (markdown) {
    finalPrompt = `Please format your response in markdown. ${prompt}`;
  }

  const result = streamText({
    model,
    prompt: finalPrompt,
  });

  return result.toDataStreamResponse();
}
