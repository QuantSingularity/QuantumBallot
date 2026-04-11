// Text-to-speech using the backend API (avoids exposing OpenAI key in the browser)
import { GLOBAL_VARIABLES } from "@/global/globalVariables";

export default async function textToSpeech(str: string): Promise<void> {
  const response = await fetch(
    `http://${GLOBAL_VARIABLES.LOCALHOST}/api/committee/text-to-speech`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: str }),
    },
  );

  if (!response.ok) {
    throw new Error(`Text-to-speech failed: ${response.statusText}`);
  }
}
