import { generateObject, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import type { ActionFunctionArgs } from "react-router";
import { type FileUpload, parseFormData } from "@mjackson/form-data-parser";

const model = anthropic("claude-3-5-sonnet-latest");

const invoiceSchema = z
  .object({
    total: z.number().describe("The total amount of the invoice."),
    currency: z.string().describe("The currency of the total amount."),
    invoiceNumber: z.string().describe("The invoice number."),
    companyAddress: z
      .string()
      .describe("The address of the company or person issuing the invoice."),
    companyName: z
      .string()
      .describe("The name of the company issuing the invoice."),
    invoiceeAddress: z
      .string()
      .describe("The address of the company or person receiving the invoice."),
  })
  .describe("The extracted data from the invoice.");

export async function loader() {
  throw new Response("Method not allowed", {
    status: 405,
    statusText: "Method Not Allowed",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await parseFormData(request);

  const invoice = formData.get("invoice") as FileUpload;

  // Validate that the file is a PDF
  if (!invoice.type || invoice.type !== "application/pdf") {
    throw new Response(
      JSON.stringify({
        status: "error",
        message: "Only PDF files are allowed",
      }),
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  const invoiceBuffer = await invoice.arrayBuffer();

  const result = await generateObject({
    model,
    schema: invoiceSchema,
    system:
      `You will receive an invoice. ` +
      `Please extract the data from the invoice.`,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: invoiceBuffer,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
  });

  return new Response(JSON.stringify(result.object));
}
