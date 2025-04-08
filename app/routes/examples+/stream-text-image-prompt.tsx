import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";
import { MemoizedMarkdown } from "~/components/MemoizedMarkdown";

export default function StreamTextImagePromptExample() {
  // State to hold the selected image file
  const [image, setImage] = useState<File | null>(null);

  const { completion, complete, input, setInput, isLoading, setCompletion } =
    useCompletion({
      api: "/api/stream-text-image",
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

  // Function to handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (input && image) {
      complete(input);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">
        Text and Image Completion Stream
      </h1>
      <div className="flex flex-col gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input || !image}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            "Send"
          )}
        </button>
        {completion && (
          <div className="relative p-4 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[100px]">
            <button
              onClick={() => {
                setInput("");
                setCompletion("");
                setImage(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="prose prose-invert max-w-none space-y-2">
              <MemoizedMarkdown id="markdown-example" content={completion} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
