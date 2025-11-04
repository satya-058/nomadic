
import { GoogleGenAI, Type } from "@google/genai";
import type { Destination } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and should be handled by the environment.
  console.warn("API_KEY is not set. Using a placeholder. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const travelSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The name of the destination, like a city or region."
      },
      description: {
        type: Type.STRING,
        description: "A compelling one-paragraph description for a solo traveler."
      },
      attractions: {
        type: Type.ARRAY,
        items: {
            type: Type.STRING,
        },
        description: "A list of 3-4 key attractions or activities."
      },
      safetyTips: {
        type: Type.STRING,
        description: "A crucial safety tip specifically for a solo traveler in that location."
      },
      image: {
        type: Type.STRING,
        description: "A descriptive prompt for an image generation model, e.g., 'A serene mountain landscape in Kyoto, Japan during autumn.'"
      }
    },
    required: ["name", "description", "attractions", "safetyTips", "image"]
  }
};


export const getTravelRecommendations = async (season: string, interest: string): Promise<Destination[]> => {
  try {
    const prompt = `Generate a list of 4 diverse travel destinations ideal for a solo traveler interested in "${interest}" during the "${season}" season. For each destination, provide a name, a compelling description, key attractions, a crucial safety tip, and a descriptive image prompt.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: travelSchema,
      },
    });

    const jsonText = response.text;
    const destinations: Destination[] = JSON.parse(jsonText);
    
    // Replace image prompt with an actual image URL from a placeholder service
    return destinations.map(dest => ({
        ...dest,
        image: `https://picsum.photos/seed/${encodeURIComponent(dest.name)}/600/400`
    }));

  } catch (error) {
    console.error("Error fetching travel recommendations:", error);
    // Return an empty array or throw a custom error to be handled by the UI
    return [];
  }
};
