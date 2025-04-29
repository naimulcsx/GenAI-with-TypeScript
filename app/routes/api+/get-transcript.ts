import { OpenAIVoice } from "@mastra/voice-openai";
import { type FileUpload, parseFormData } from "@mjackson/form-data-parser";
import type { ActionFunctionArgs } from "react-router";
import { Readable } from "stream";

const voice = new OpenAIVoice({
  listeningModel: {
    name: "whisper-1",
    apiKey: process.env.OPENAI_API_KEY,
  },
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await parseFormData(request);
  const audioFile = formData.get("audio") as FileUpload;

  if (!audioFile) {
    throw new Error("No audio file provided");
  }

  const audioStream = Readable.fromWeb(audioFile.stream() as any);

  const transcript = await voice.listen(audioStream, {
    filetype: "webm",
  });

  return Response.json({ transcript });
}
