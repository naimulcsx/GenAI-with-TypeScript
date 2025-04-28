import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function meta() {
  return [
    { title: "GenAI with TypeScript" },
    {
      name: "description",
      content:
        "A learning project exploring modern AI application development using TypeScript, focusing on state-of-the-art SDKs, frameworks, and architectural patterns.",
    },
  ];
}

export const examples = [
  {
    title: "Text Completion",
    path: "/examples/text-completion",
    description: "Simple text completions using AI models",
    tags: ["vercel-ai-sdk"],
  },
  {
    title: "Text Completion (Streaming)",
    path: "/examples/text-completion-streaming",
    description: "Text completions using AI models with streaming responses",
    tags: ["vercel-ai-sdk", "streaming"],
  },
  {
    title: "Image Analysis",
    path: "/examples/image-analysis",
    description: "Attach images to get textual descriptions and analyses",
    tags: ["vercel-ai-sdk", "attachments", "streaming"],
  },
  {
    title: "Invoice Data Extraction",
    path: "/examples/invoice-data-extraction",
    description: "Generate structured data from PDF using AI models",
    tags: ["vercel-ai-sdk", "attachments"],
  },
  {
    title: "Invoice Data Extraction (Streaming)",
    path: "/examples/invoice-data-extraction-streaming",
    description:
      "Generate structured data from PDF using AI models with streaming response",
    tags: ["vercel-ai-sdk", "streaming", "attachments"],
  },
  {
    title: "AI Chat Assistant",
    path: "/examples/ai-chat-assistant",
    description:
      "Interactive chat interface with streaming responses, perfect for building conversational AI applications.",
    tags: ["vercel-ai-sdk", "streaming"],
  },
  {
    title: "Weather Assistant",
    path: "/examples/weather-assistant",
    description: "Get real-time weather information using Tool Calls",
    tags: ["vercel-ai-sdk", "tool-calls", "api-integration"],
  },
  {
    title: "Commit Message Generator",
    path: "/examples/commit-formatter",
    description:
      "Convert natural language descriptions into conventional commit messages",
    tags: ["vercel-ai-sdk", "streaming"],
  },
];

export default function Index() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          GenAI with TypeScript
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          A learning project exploring modern AI application development using
          TypeScript, focusing on state-of-the-art SDKs, frameworks, and
          architectural patterns.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example, index) => (
          <Link key={index} to={example.path} className="block">
            <Card className="h-full transition-colors hover:bg-muted/50 gap-3">
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{example.description}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-4">
                  {example.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs bg-muted px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
