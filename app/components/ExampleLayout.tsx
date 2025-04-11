import { Code2, FileCode, Play } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ScrollArea } from "~/components/ui/scroll-area";
import { MemoizedMarkdown } from "~/components/MemoizedMarkdown";
import { formatCodeContent } from "~/utils/format-code-contents";

interface File {
  name: string;
  content: string;
  language: string;
}

interface ExampleLayoutProps {
  files: File[];
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ExampleLayout({
  files,
  title,
  description,
  children,
}: ExampleLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="w-[50%] border-r">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto px-5 py-8">
            <div className="space-y-6">
              <div className="border-b pb-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5"
                  >
                    <Play className="h-3 w-3" />
                    Playground
                  </Badge>
                </div>
                <p className="text-base text-muted-foreground mt-1">
                  {description}
                </p>
              </div>
              {children}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Code panel */}
      <div className="w-[50%]">
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Implementation</h2>
            </div>
            <Tabs defaultValue={files[0].name} className="w-full">
              <TabsList
                className="grid w-full"
                style={{ gridTemplateColumns: `repeat(${files.length}, 1fr)` }}
              >
                {files.map((file) => (
                  <TabsTrigger
                    key={file.name}
                    value={file.name}
                    className="flex items-center gap-2"
                  >
                    <FileCode className="h-4 w-4" />
                    {file.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {files.map((file) => (
                <TabsContent key={file.name} value={file.name} className="mt-4">
                  <div className="prose prose-md prose-pre:bg-foreground">
                    <MemoizedMarkdown
                      id={`markdown-${file.name}`}
                      content={formatCodeContent(file.content, file.language)}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
