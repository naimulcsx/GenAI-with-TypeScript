import { streamText } from "ai";
import type { ActionFunctionArgs } from "react-router";
import { model } from "~/model";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();

  const result = streamText({
    model,
    messages: body.messages,
  });

  return result.toDataStreamResponse();
}
