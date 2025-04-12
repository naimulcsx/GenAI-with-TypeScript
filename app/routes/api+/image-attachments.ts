import { streamText } from "ai";
import { z } from "zod";
import type { ActionFunctionArgs } from "react-router";
import { type FileUpload, parseFormData } from "@mjackson/form-data-parser";
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

  // Parse the multipart form data from the request
  const formData = await parseFormData(request);

  // Extract the text prompt and image file from form data
  const prompt = formData.get("prompt") as string;
  const image = formData.get("image") as FileUpload;

  // Convert the uploaded image to an ArrayBuffer for processing
  const imageBuffer = await image.arrayBuffer();

  // Validate the input data against our schema
  const { success, data } = schema.safeParse({ prompt });

  // Return an error response if validation fails
  if (!success) {
    return new Response("Missing prompt", { status: 400 });
  }

  // Generate a streaming text response using the AI model
  const result = streamText({
    model,
    messages: [
      {
        // Use the prompt as system message to set context
        role: "system",
        content: prompt,
      },
      {
        // Send the image as user content
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

  // We can also use `result.toDataStreamResponse()` directly
  // as response instance of manually constructing the response

  // Convert the result to a readable stream
  const stream = result.toDataStream();

  // Return the stream as a text/plain response with chunked encoding
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
