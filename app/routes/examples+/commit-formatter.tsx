import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";
import { MemoizedMarkdown } from "~/components/MemoizedMarkdown";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Loader2, X, Mic, StopCircle } from "lucide-react";
import { ExampleLayout } from "~/components/ExampleLayout";
import { readFileSync } from "fs";
import path from "path";
import { examples } from "../index";
import type { Route } from "./+types/commit-formatter";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTranscribe } from "~/hooks/use-transcribe";

interface Preset {
  id: string;
  prompt: string;
  description: string;
}

const presets: Preset[] = [
  {
    id: "feature",
    prompt: "Add new user authentication system with OAuth integration",
    description: "A new feature implementation",
  },
  {
    id: "fix",
    prompt: "Fix the login button not working on mobile devices",
    description: "A bug fix example with a specific issue",
  },
  {
    id: "docs",
    prompt: "Update API documentation for the new endpoints",
    description: "Documentation update example",
  },
  {
    id: "refactor",
    prompt: "Improve the performance of the search algorithm",
    description: "Code refactoring example",
  },
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
      name: "api/commit-formatter.ts",
      path: "../api+/commit-formatter.ts",
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

  const meta = examples.find((e) => e.path === "/examples/commit-formatter")!;

  return { meta, files: filesWithContent };
}

export default function CommitFormatterExample({
  loaderData,
}: Route.ComponentProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const { completion, complete, input, setInput, isLoading, setCompletion } =
    useCompletion({
      api: "/api/commit-formatter",
      fetch: (api) => {
        const formData = new FormData();
        if (input) formData.append("prompt", input);
        return fetch(api, {
          method: "POST",
          body: formData,
        });
      },
    });

  const { isRecording, isTranscribing, startRecording, stopRecording, error } =
    useTranscribe({
      onTranscribe: (transcript) => {
        setInput(transcript);
      },
    });

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset.id);
    setInput(preset.prompt);
  };

  const handleClear = () => {
    setInput("");
    setCompletion("");
    setSelectedPreset(null);
  };

  return (
    <ExampleLayout
      files={loaderData.files}
      title={loaderData.meta.title}
      description={loaderData.meta.description}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {presets.map((preset) => (
            <Card
              key={preset.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPreset === preset.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handlePresetSelect(preset)}
            >
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {preset.description}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{preset.prompt}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your changes in natural language..."
            className="min-h-[100px]"
          />

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              className={`h-9 w-9 ${
                isRecording ? "bg-red-100 hover:bg-red-200" : ""
              }`}
              disabled={isTranscribing}
            >
              {isRecording ? (
                <StopCircle className="h-4 w-4" />
              ) : isTranscribing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={() => complete(input)}
              disabled={isLoading || !input}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Commit Message"
              )}
            </Button>
          </div>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        {completion && (
          <div className="relative rounded-lg border p-1">
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">Generated Commit Message</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-3 bg-muted/75 rounded-sm mt-12">
              <div className="prose prose-sm max-w-none mr-4">
                <MemoizedMarkdown
                  id="commit-formatter-markdown"
                  content={completion}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ExampleLayout>
  );
}
