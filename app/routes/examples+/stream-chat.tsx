import { useChat } from "@ai-sdk/react";

export default function StreamChatUIExample() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/stream-chat",
  });

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Chat UI Stream</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-md ${
                message.role === "user"
                  ? "bg-blue-100 dark:bg-blue-900 ml-auto"
                  : "bg-gray-50 dark:bg-gray-800"
              } max-w-[80%]`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading}
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
        </form>
      </div>
    </div>
  );
}
