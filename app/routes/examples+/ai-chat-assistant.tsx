import { useChat } from "@ai-sdk/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Loader2, User, Bot } from "lucide-react";
import { ExampleLayout } from "~/components/ExampleLayout";
import { readFileSync } from "fs";
import path from "path";
import { examples } from "../index";
import { useRef } from "react";
import { useEffect } from "react";
import { MemoizedMarkdown } from "~/components/MemoizedMarkdown";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/ai-chat-assistant";

const suggestions = [
  "What is the difference between React and Vue?",
  "Explain how to use TypeScript with React",
  "What are the best practices for state management in React?",
  "How do I implement authentication in a Next.js app?",
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
      name: "api/stream-chat.ts",
      path: "../api+/stream-chat.ts",
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

  const meta = examples.find((e) => e.path === "/examples/ai-chat-assistant")!;

  return { meta, files: filesWithContent };
}

export default function StreamChatUIExample({
  loaderData,
}: {
  loaderData: any;
}) {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/stream-chat",
  });

  const isLoading = status === "submitted" || status === "streaming";

  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
                <div
                  className={`py-3 px-4 rounded-md text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  } max-w-[80%]`}
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
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
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
