import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from "../types";

// Initialize the client
// Note: In a real deployment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWallpapers = async (
  prompt: string,
  count: number = 4
): Promise<GeneratedImage[]> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: count,
        outputMimeType: 'image/jpeg',
        aspectRatio: '9:16',
      },
    });

    if (!response.generatedImages) {
      throw new Error("No images were generated.");
    }

    return response.generatedImages.map((img) => ({
      id: crypto.randomUUID(),
      base64: img.image.imageBytes,
      prompt: prompt,
      createdAt: Date.now(),
    }));

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Enhance error message for UI
    let message = "Failed to generate images.";
    if (error.message) {
      message += ` ${error.message}`;
    }
    throw new Error(message);
  }
};
