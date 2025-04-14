import {
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  tool,
  ToolExecutionError,
} from "ai";
import { z } from "zod";
import type { ActionFunctionArgs } from "react-router";
import { model } from "~/model";

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

  // TODO: Validate the request body
  // Extract messages from the request body
  const messages = body.messages;

  // Generate streaming text using the AI model with the provided prompt
  // Add instruction to format response in markdown for better display
  const result = streamText({
    model,
    messages,
    maxSteps: 2,
    tools: {
      weatherFinder: tool({
        description: "Get the weather in a location",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const geocodingResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              location
            )}&count=1`
          );

          if (!geocodingResponse.ok) {
            throw new Error("Failed to fetch geocoding data");
          }

          const geocodingData = await geocodingResponse.json();

          if (!geocodingData.results || geocodingData.results.length === 0) {
            throw new Error("Location not found");
          }

          const { latitude, longitude } = geocodingData.results[0];

          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
          );

          if (!weatherResponse.ok) {
            throw new Error("Failed to fetch weather data");
          }

          const weatherData = await weatherResponse.json();

          return weatherData;
        },
      }),
    },
  });

  // Turn the result to a data stream response
  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      if (NoSuchToolError.isInstance(error)) {
        return "The model tried to call a unknown tool.";
      } else if (InvalidToolArgumentsError.isInstance(error)) {
        return "The model called a tool with invalid arguments.";
      } else if (ToolExecutionError.isInstance(error)) {
        return "An error occurred during tool execution.";
      } else {
        return "An unknown error occurred.";
      }
    },
  });
}
