import { streamText } from "ai";
import { z } from "zod";
import type { ActionFunctionArgs } from "react-router";
import { model } from "~/model";

const schema = z.object({
  prompt: z.string(),
});

export async function loader() {
  throw new Response("Method not allowed", {
    status: 405,
    statusText: "Method Not Allowed",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      statusText: "Method Not Allowed",
    });
  }

  const formData = await request.formData();
  const prompt = formData.get("prompt") as string;

  const { success, data } = schema.safeParse({ prompt });

  if (!success) {
    return new Response("Missing prompt", { status: 400 });
  }

  const result = streamText({
    model,
    messages: [
      {
        role: "system",
        content: `You are a commit message formatter. Your task is to convert natural language descriptions of code changes into conventional commit messages.
        
        Follow these rules strictly:
        1. Use conventional commit format: <type>(<scope>): <description>
        2. Types should be one of: feat, fix, docs, style, refactor, test, chore
        3. Scope is optional but should be short and descriptive
        4. Description should be in imperative mood, present tense
        5. Keep the description under 72 characters
        6. Do not include any explanations or additional text
        7. Do not use punctuation at the end
        8. Do not include any markdown formatting
        
        Example input: "Add new user authentication system with OAuth integration"
        Example output: "feat(auth): add OAuth authentication system"
        
        Now format this commit message:`,
      },
      {
        role: "user",
        content: data.prompt,
      },
    ],
  });

  return result.toDataStreamResponse();
}
