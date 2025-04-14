import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { MemoizedMarkdown } from "~/components/MemoizedMarkdown";
import { useChat } from "@ai-sdk/react";
import { readFileSync } from "fs";
import { examples } from "../index";
import path from "path";
import type { Route } from "./+types/weather-assistant";
import { ExampleLayout } from "~/components/ExampleLayout";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { User, Bot } from "lucide-react";
import { cn } from "~/lib/utils";
import { Weather } from "~/components/Weather";

const suggestions = [
  "What's the weather like in New York City?",
  "How's the temperature in London right now?",
  "Is it going to be sunny in Paris this weekend?",
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
      name: "api/weather-finder.ts",
      path: "../api+/weather-assistant.ts",
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

  const meta = examples.find((e) => e.path === "/examples/weather-assistant")!;

  return { meta, files: filesWithContent };
}

export default function WeatherFinder({ loaderData }: Route.ComponentProps) {
  const { messages, input, handleInputChange, handleSubmit, status, error } =
    useChat({
      api: "/api/weather-assistant",
    });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages]);

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
              onClick={() => {
                const event = {
                  target: { value: suggestion },
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(event);
              }}
              className="text-sm"
            >
              {suggestion}
            </Button>
          ))}
        </div>

        <ScrollArea
          className="h-[60vh] rounded-md border p-4"
          ref={scrollAreaRef}
        >
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {message.role === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-4">
                  {message.parts
                    .filter((part) => part.type === "tool-invocation")
                    .map(({ toolInvocation }) => {
                      const { toolName, toolCallId, state } = toolInvocation;

                      if (state === "result") {
                        const { result } = toolInvocation;

                        return (
                          <div key={toolCallId}>
                            {toolName === "weatherFinder" ? (
                              <Weather weatherAtLocation={result} />
                            ) : (
                              <pre>{JSON.stringify(result, null, 2)}</pre>
                            )}
                          </div>
                        );
                      }

                      if (!error) {
                        return (
                          <Loader2 className="mt-2.5 h-4 w-4 animate-spin" />
                        );
                      }

                      return null;
                    })}

                  {message.content && (
                    <div
                      className={`py-3 px-4 rounded-md text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div
                        className={cn(
                          "prose prose-sm",
                          message.role === "user" && "prose-p:text-white/90"
                        )}
                      >
                        <MemoizedMarkdown
                          id={`message-${index}`}
                          content={message.content}
                        />
                      </div>
                    </div>
                  )}

                  {index === messages.length - 1 && error && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {error?.message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about weather in any location..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </form>
      </div>
    </ExampleLayout>
  );
}
