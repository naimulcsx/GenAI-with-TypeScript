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
    { title: "Vercel AI SDK Examples" },
    {
      name: "description",
      content: "Explore examples of Vercel AI SDK with React Router.",
    },
  ];
}

export const examples = [
  {
    title: "Text Completion",
    path: "/examples/text-completion",
    description: "Text completions using AI models",
  },
  {
    title: "Text Completion (Streaming)",
    path: "/examples/text-completion-streaming",
    description: "Text completions using AI models with streaming responses",
  },
  {
    title: "Image Analysis",
    path: "/examples/image-analysis",
    description: "Attach images to get textual descriptions and analyses",
  },
  {
    title: "Invoice Data Extraction",
    path: "/examples/invoice-data-extraction",
    description: "Generate structured data from PDF using AI models",
  },
  {
    title: "Invoice Data Extraction (Streaming)",
    path: "/examples/invoice-data-extraction-streaming",
    description:
      "Generate structured data from PDF using AI models with streaming response",
  },
  {
    title: "AI Chat Assistant",
    path: "/examples/ai-chat-assistant",
    description:
      "Interactive chat interface with streaming responses, perfect for building conversational AI applications.",
  },
  {
    title: "Weather Assistant",
    path: "/examples/weather-assistant",
    description: "Get real-time weather information using Tool Calls",
  },
];

export default function Index() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Vercel AI SDK Examples
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore examples of Vercel AI SDK with React Router.
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
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
