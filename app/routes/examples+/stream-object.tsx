import { useState, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";

export default function StreamObjectExample() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { object, submit, isLoading } = useObject({
    api: "/api/stream-object",
    schema: z.object({
      total: z.number(),
      currency: z.string(),
      invoiceNumber: z.string(),
      companyAddress: z.string(),
      companyName: z.string(),
      invoiceeAddress: z.string(),
      timestamp: z.number(),
    }),
    fetch: (api) => {
      const formData = new FormData();
      if (file) formData.append("invoice", file);

      return fetch(api, {
        method: "POST",
        body: formData,
      });
    },
  });

  const handleSubmit = async () => {
    submit("");
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Invoice Data Extraction</h1>
      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading || !file}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            "Extract Data"
          )}
        </button>

        {object && (
          <div className="relative p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <button
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
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
            <div className="grid grid-cols-2 gap-8">
              <div className="font-mono text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(object, null, 2)}
                </pre>
              </div>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="font-semibold">Company Name:</dt>
                  <dd>{object.companyName}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Invoice Number:</dt>
                  <dd>{object.invoiceNumber}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Total:</dt>
                  <dd>{`${object.total} ${object.currency}`}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Company Address:</dt>
                  <dd className="whitespace-pre-wrap">
                    {object.companyAddress}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Invoicee Address:</dt>
                  <dd className="whitespace-pre-wrap">
                    {object.invoiceeAddress}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
