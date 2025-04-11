import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { readFileSync } from "fs";
import { examples } from "../index";
import path from "path";
import type { Route } from "./+types/generate-text";
import { ExampleLayout } from "~/components/ExampleLayout";

const suggestions = [
  "Tell me a joke",
  "Explain quantum computing in simple terms",
  "Write a short poem about nature",
];

export async function loader() {
  const files = [
    {
      name: "api/generate-text.ts",
      path: "../api+/generate-text.ts",
      language: "ts",
    },
    {
      name: "model.ts",
      path: "../../model.ts",
      language: "ts",
    },
  ];

  const filesWithContent = files.map((file) => {
    const content = readFileSync(
      path.resolve(import.meta.dirname, file.path),
      "utf-8"
    );
    return {
      ...file,
      content,
    };
  });

  return { files: filesWithContent };
}

export default function GenerateTextExample({
  loaderData,
}: Route.ComponentProps) {
  const [completion, setCompletion] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const example = examples.find((e) => e.path === "/examples/generate-text")!;

  const handleSend = async () => {
    setCompletion("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setCompletion(data.text);
    } catch (error) {
      console.error("Error fetching completion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ExampleLayout
      files={loaderData.files}
      title={example.title}
      description={example.description}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => setInput(suggestion)}
              className="text-sm"
            >
              {suggestion}
            </Button>
          ))}
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt here..."
          className="min-h-[100px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send"
          )}
        </Button>
        {completion && (
          <div className="relative rounded-lg border p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => {
                setInput("");
                setCompletion("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <p className="whitespace-pre-wrap">{completion}</p>
          </div>
        )}
      </div>
    </ExampleLayout>
  );
}
