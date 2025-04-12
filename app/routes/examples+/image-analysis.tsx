import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";
import { MemoizedMarkdown } from "~/components/MemoizedMarkdown";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { ExampleLayout } from "~/components/ExampleLayout";
import { readFileSync } from "fs";
import path from "path";
import { examples } from "../index";
import type { Route } from "./+types/image-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface Preset {
  id: string;
  imageUrl: string;
  prompt: string;
  description: string;
}

const presets: Preset[] = [
  {
    id: "nature",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&w=800&q=80",
    prompt: "Describe the natural elements and atmosphere in this landscape",
    description: "A serene landscape with mountains and a lake",
  },
  {
    id: "city",
    imageUrl:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&w=800&q=80",
    prompt: "Analyze the urban environment and architecture in this cityscape",
    description: "A bustling city street with modern architecture",
  },
  {
    id: "art",
    imageUrl:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&w=800&q=75",
    prompt:
      "Interpret the artistic style, techniques, and deeper meaning of this artwork",
    description: "A colorful abstract painting",
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
      name: "api/image-attachments.ts",
      path: "../api+/image-attachments.ts",
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

  const meta = examples.find((e) => e.path === "/examples/image-analysis")!;

  return { meta, files: filesWithContent };
}

export default function StreamTextImagePromptExample({
  loaderData,
}: Route.ComponentProps) {
  const [image, setImage] = useState<File | null>(null);
  const [renderMarkdown, setRenderMarkdown] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const { completion, complete, input, setInput, isLoading, setCompletion } =
    useCompletion({
      api: "/api/image-attachments",
      fetch: (api) => {
        const formData = new FormData();
        if (input) formData.append("prompt", input);
        if (image) formData.append("image", image);

        return fetch(api, {
          method: "POST",
          body: formData,
        });
      },
    });

  const handlePresetSelect = async (preset: Preset) => {
    setSelectedPreset(preset.id);
    setInput(preset.prompt);

    try {
      const response = await fetch(preset.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `${preset.description}.jpg`, {
        type: "image/jpeg",
      });
      setImage(file);
    } catch (error) {
      console.error("Error loading preset image:", error);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setSelectedPreset(null);
  };

  return (
    <ExampleLayout
      files={loaderData.files}
      title={loaderData.meta.title}
      description={loaderData.meta.description}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <Card
              key={preset.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPreset === preset.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handlePresetSelect(preset)}
            >
              <CardHeader>
                <CardTitle className="text-sm font-normal">
                  {preset.prompt}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                  <img
                    src={preset.imageUrl}
                    alt={preset.description}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <ImageIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt here..."
          className="min-h-[100px]"
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              {selectedPreset ? (
                <div className="flex items-center justify-between h-9 px-2 border rounded-md bg-muted/50">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {
                          presets.find((p) => p.id === selectedPreset)
                            ?.description
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearImage}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90"
                  />
                </div>
              )}
            </div>
            <Button
              onClick={() => complete(input)}
              disabled={isLoading || !input || !image}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </div>

        {completion && (
          <div className="relative rounded-lg border p-1">
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
                    setImage(null);
                    setSelectedPreset(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-3 bg-muted/75 rounded-sm mt-12">
              <div className="prose prose-sm max-w-none mr-4">
                {renderMarkdown ? (
                  <MemoizedMarkdown
                    id="stream-text-image-markdown"
                    content={completion}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{completion}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ExampleLayout>
  );
}
