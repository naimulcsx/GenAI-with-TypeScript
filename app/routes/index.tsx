import { Link } from "react-router";

export function meta() {
  return [
    { title: "Vercel AI SDK Examples" },
    {
      name: "description",
      content: "Explore examples of Vercel AI SDK with React Router.",
    },
  ];
}

export default function Index() {
  const examples = [
    {
      title: "Generate Text",
      path: "/examples/generate-text",
      description:
        "Generate text completions using AI models with a simple prompt-based interface.",
    },
    {
      title: "Stream Text with Chat Prompt",
      path: "/examples/stream-text-chat-prompt",
      description:
        "Stream text completions using a simple prompt-based interface with real-time updates as the AI generates content.",
    },
    {
      title: "Stream Text with Markdown",
      path: "/examples/stream-text-markdown",
      description:
        "Generate and stream markdown-formatted text responses that can be rendered as rich content.",
    },
    {
      title: "Stream Text with Image Prompt",
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Vercel AI SDK Examples</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Explore examples of Vercel AI SDK with React Router.
      </p>
      <ul className="divide divide-y-1 divide-gray-600">
        {examples.map((example, index) => (
          <li key={index} className="block py-4">
            <Link
              to={example.path}
              className="text-blue-600 dark:text-blue-400 hover:underline text-lg"
            >
              {example.title}
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {example.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
