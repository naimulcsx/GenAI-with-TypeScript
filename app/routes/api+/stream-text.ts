import { streamText } from "ai";
import { z } from "zod";
import type { ActionFunctionArgs } from "react-router";
import { model } from "~/model";

// Define validation schema for the request body
// Requires a prompt string in the request
const schema = z.object({
  prompt: z.string(),
});

// Handle GET requests by returning a 405 Method Not Allowed response
// This endpoint only supports POST requests for streaming text generation
export async function loader() {
  throw new Response("Method not allowed", {
    status: 405,
    statusText: "Method Not Allowed",
  });
}

// Handle POST requests to stream text based on the provided prompt
export async function action({ request }: ActionFunctionArgs) {
  // If the request method is not POST
  // Return a 405 Method Not Allowed response
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      statusText: "Method Not Allowed",
    });
  }

  // Parse the JSON body from the request
  const body = await request.json();

  // Validate the request body against our schema
  const { success, data } = schema.safeParse(body);

  // Return an error if validation fails
  if (!success) {
    return new Response("Missing prompt", { status: 400 });
  }

  // Extract the prompt from the validated data
  const prompt = data.prompt;

  // Generate streaming text using the AI model with the provided prompt
  // Add instruction to format response in markdown for better display
  const result = streamText({
    model,
    prompt,
  });

  // Turn the result to a text stream response
  // This enables text streaming to the frontend
  // https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol
  return result.toTextStreamResponse();
}
