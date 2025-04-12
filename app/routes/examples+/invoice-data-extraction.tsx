import { useState } from "react";
import { MemoizedMarkdown } from "~/components/MemoizedMarkdown";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Loader2, X, FileText, ExternalLink } from "lucide-react";
import { ExampleLayout } from "~/components/ExampleLayout";
import { readFileSync } from "fs";
import path from "path";
import { examples } from "../index";
import type { Route } from "./+types/invoice-data-extraction";

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
      name: "api/generate-object.ts",
      path: "../api+/generate-object.ts",
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
    (e) => e.path === "/examples/invoice-data-extraction"
  )!;

  return { meta, files: filesWithContent };
}

export default function InvoiceObjectGeneratorExample({
  loaderData,
}: Route.ComponentProps) {
  const [invoice, setInvoice] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handlePresetSelect = async (preset: Preset) => {
    setSelectedPreset(preset.id);
    try {
      const response = await fetch(preset.url);
      const blob = await response.blob();
      const file = new File([blob], `${preset.name}.pdf`, {
        type: "application/pdf",
      });
      setInvoice(file);
    } catch (error) {
      console.error("Error loading preset invoice:", error);
    }
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInvoice(e.target.files[0]);
      setSelectedPreset(null);
    }
  };

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

  const handleClear = () => {
    setResult("");
    setInvoice(null);
    setSelectedPreset(null);
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
                  onChange={handleInvoiceChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90"
                />
              )}
              <Button onClick={handleSubmit} disabled={isLoading || !invoice}>
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

        {result && (
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
              <div className="relative rounded-md bg-muted p-4">
                <pre className="whitespace-pre-wrap break-words text-sm">
                  {result}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ExampleLayout>
  );
}
