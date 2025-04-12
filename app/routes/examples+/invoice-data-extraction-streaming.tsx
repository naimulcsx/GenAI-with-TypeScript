import { useState, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Loader2, X, FileText, ExternalLink } from "lucide-react";
import { ExampleLayout } from "~/components/ExampleLayout";
import { readFileSync } from "fs";
import path from "path";
import { examples } from "../index";
import type { Route } from "./+types/invoice-data-extraction-streaming";

interface Preset {
  id: string;
  name: string;
  description: string;
  url: string;
}

const presets: Preset[] = [
  {
    id: "invoice-1",
    name: "Sample Invoice #1",
    description: "A simple retail invoice with standard items",
    url: "/presets/invoices/invoice-1.pdf",
  },
  {
    id: "invoice-2",
    name: "Sample Invoice #2",
    description: "A service-based invoice with multiple line items",
    url: "/presets/invoices/invoice-2.pdf",
  },
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
      name: "api/stream-object.ts",
      path: "../api+/stream-object.ts",
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

  const meta = examples.find(
    (e) => e.path === "/examples/invoice-data-extraction-streaming"
  )!;

  return { meta, files: filesWithContent };
}

export default function StreamObjectExample({
  loaderData,
}: {
  loaderData: any;
}) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const { object, submit, isLoading } = useObject({
    api: "/api/stream-object",
    schema: z.object({
      total: z.number(),
      currency: z.string(),
      invoiceNumber: z.string(),
      companyAddress: z.string(),
      companyName: z.string(),
      invoiceAddress: z.string(),
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

  const handleClear = () => {
    setFile(null);
    setSelectedPreset(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePresetSelect = async (preset: Preset) => {
    setSelectedPreset(preset.id);
    try {
      const response = await fetch(preset.url);
      const blob = await response.blob();
      const file = new File([blob], `${preset.name}.pdf`, {
        type: "application/pdf",
      });
      setFile(file);
    } catch (error) {
      console.error("Error loading preset invoice:", error);
    }
  };

  return (
    <ExampleLayout
      files={loaderData.files}
      title={loaderData.meta.title}
      description={loaderData.meta.description}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {presets.map((preset) => (
            <Card
              key={preset.id}
              className={`cursor-pointer transition-all hover:shadow-lg gap-2 ${
                selectedPreset === preset.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handlePresetSelect(preset)}
            >
              <CardHeader className="flex flex-row justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                  {preset.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 relative bottom-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(preset.url, "_blank");
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0 text-muted-foreground">
                <p className="text-sm">{preset.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              {selectedPreset ? (
                <div className="flex items-center justify-between flex-1 h-9 px-2 border rounded-md bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {presets.find((p) => p.id === selectedPreset)?.name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    setSelectedPreset(null);
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90"
                />
              )}
              <Button onClick={handleSubmit} disabled={isLoading || !file}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Process Invoice"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {object && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Extracted Data</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
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
                      {object.invoiceAddress}
                    </dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ExampleLayout>
  );
}
