import { useState } from "react";
import { MemoizedMarkdown } from "~/components/MemoizedMarkdown";

export default function InvoiceObjectGeneratorExample() {
  // State to hold the selected invoice file
  const [invoice, setInvoice] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle invoice selection
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInvoice(e.target.files[0]);
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!invoice) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("invoice", invoice);

      const response = await fetch("/api/generate-object", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error:", error);
      setResult("Error processing invoice");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Invoice Data Extraction</h1>
      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleInvoiceChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !invoice}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            "Process Invoice"
          )}
        </button>
        {result && (
          <div className="relative p-4 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[100px]">
            <button
              onClick={() => {
                setResult("");
                setInvoice(null);
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
            <pre className="whitespace-pre-wrap break-words">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
