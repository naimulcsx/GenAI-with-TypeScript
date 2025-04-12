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
    title: "Generate Text",
    path: "/examples/generate-text",
    description: "Text completions using AI models",
  },
  {
    title: "Stream Text",
    path: "/examples/stream-text",
    description: "Text completions using AI models with streaming responses",
  },
  {
    title: "Attachments",
    path: "/examples/stream-text-image-prompt",
    description:
      "Upload images and get AI-generated text descriptions and analysis streamed in real-time.",
  },
  {
    title: "Generate Object",
    path: "/examples/generate-object",
    description:
      "Generate structured JSON data from documents like invoices, using AI models to extract key information into organized data formats.",
  },
  {
    title: "Stream Object",
    path: "/examples/stream-object",
    description:
      "Stream extracted invoice data in real-time as the AI processes and structures information from documents into JSON format.",
  },
  {
    title: "Stream Chat System",
    path: "/examples/stream-chat",
    description:
      "Interactive chat interface with streaming responses, perfect for building conversational AI applications.",
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
            <Card className="h-full transition-colors hover:bg-muted/50">
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
