import { GoogleGenAI } from "@google/genai";

import { env } from "../config/env";

export const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const preferredModels = [
  "gemini-3.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3-flash-preview",
];

let cachedModel: string | null = null;

export async function getAvailableGeminiModel(): Promise<string> {
  if (cachedModel) {
    return cachedModel;
  }

  const models = await gemini.models.list();

  const availableModels: string[] = [];

  for await (const model of models) {
    if (
      model.name &&
      model.supportedActions?.includes("generateContent")
    ) {
      availableModels.push(model.name.replace("models/", ""));
    }
  }

  const selectedModel = preferredModels.find((model) =>
    availableModels.includes(model),
  );

  if (!selectedModel) {
    throw new Error(
      "No Gemini model supporting generateContent is available.",
    );
  }

  cachedModel = selectedModel;

  return selectedModel;
}