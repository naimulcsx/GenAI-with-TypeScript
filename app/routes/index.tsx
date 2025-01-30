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
    },
    {
      title: "Stream Text with Chat Prompt",
      path: "/examples/stream-text-chat-prompt",
    },
    {
      title: "Stream Text with Markdown",
      path: "/examples/stream-text-markdown",
    },
    {
      title: "Stream Text with Image Prompt",
      path: "/examples/stream-text-image-prompt",
    },
    {
      title: "Generate Object",
      path: "/examples/generate-object",
    },
    {
      title: "Stream Object",
      path: "/examples/stream-object",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Vercel AI SDK Examples</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Explore examples of Vercel AI SDK with React Router.
      </p>
      <ul className="space-y-4">
        {examples.map((example, index) => (
          <li key={index}>
            <Link
              to={example.path}
              className="text-blue-600 dark:text-blue-400 hover:underline text-lg"
            >
              {example.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
