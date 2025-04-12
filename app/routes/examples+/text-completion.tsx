import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { readFileSync } from "fs";
import { examples } from "../index";
import path from "path";
import type { Route } from "./+types/text-completion";
import { MemoizedMarkdown } from "~/components/MemoizedMarkdown";
import { ExampleLayout } from "~/components/ExampleLayout";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

const suggestions = [
  "Tell me a joke",
  "Explain quantum computing in simple terms",
  "Write a short poem about nature",
];

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: `${data.meta.title} | Vercel AI SDK Examples`,
    },
  ];
}

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

  const meta = examples.find((e) => e.path === "/examples/text-completion")!;

  return { meta, files: filesWithContent };
}

export default function GenerateTextExample({
  loaderData,
}: Route.ComponentProps) {
  const [completion, setCompletion] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [renderMarkdown, setRenderMarkdown] = useState(true);

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
      title={loaderData.meta.title}
      description={loaderData.meta.description}
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
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">Response</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="markdown-render"
                    checked={renderMarkdown}
                    onCheckedChange={setRenderMarkdown}
                  />
                  <Label htmlFor="markdown-render" className="text-sm">
                    Render Markdown
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setInput("");
                    setCompletion("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[380px] p-3 bg-muted/75 rounded-sm mt-12">
              <div className="prose prose-sm max-w-none mr-4">
                {renderMarkdown ? (
                  <MemoizedMarkdown
                    id="stream-text-markdown"
                    content={completion}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{completion}</p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </ExampleLayout>
  );
}
