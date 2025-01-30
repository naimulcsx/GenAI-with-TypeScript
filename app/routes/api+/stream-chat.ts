import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import type { ActionFunctionArgs } from "react-router";

const model = anthropic("claude-3-5-sonnet-latest");

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();

  const result = streamText({
    model,
    messages: body.messages,
  });

  return result.toDataStreamResponse();
}
