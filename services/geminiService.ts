
import { GoogleGenAI, Type } from "@google/genai";
import { CapsuleEntry, CapsuleAnalysis, WeeklyLetter, UserProfile } from "../types";

// Initialize AI Client directly
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_API_KEY || process.env.API_KEY;
if (!apiKey) console.warn("Missing API Key");
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const getSystemInstruction = (profile: UserProfile) => {
  const personas: Record<string, string> = {
    empathetic: "a deeply warm, empathetic, and nurturing archivist who focuses on feelings and validation.",
    stoic: "a calm, objective, and grounding archivist who focuses on logic, resilience, and growth.",
    poetic: "a lyrical, philosophical, and dreamy archivist who finds beauty and metaphor in the mundane."
  };

  const personaDesc = personas[profile.persona] || personas['nurturer'] || "a warm and nurturing archivist.";

  return `You are 'The Capsule,' ${personaDesc}. 
Your user is ${profile.name}. Their current life focus is: "${profile.northStar}".
When processing a voice recording:
1. Transcribe it accurately.
2. Analyze the mood and key events.
3. Provide a response (1-2 sentences) tailored to their name and life focus.
4. Extract tags and a summary.
5. Create an 'imagePrompt': a detailed description for an abstract visual metaphor representing the mood and theme of this entry (e.g., 'A solitary lighthouse in a sea of violet mist' for a lonely but hopeful entry).

You must return a valid JSON object.`;
};

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    transcript: { type: Type.STRING },
    summary: { type: Type.STRING },
    mood: { type: Type.STRING },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    response: { type: Type.STRING },
    imagePrompt: { type: Type.STRING, description: "Prompt for an abstract visual metaphor." }
  },
  required: ["transcript", "summary", "mood", "tags", "response", "imagePrompt"]
};

export const generateSoulCard = async (prompt: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'imagen-3.0-generate-001',
      contents: {
        parts: [{ text: `A beautiful, minimalist, abstract digital art piece: ${prompt}. Artistic, soft colors, high quality.` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return undefined;
};

export const analyzeVoiceNote = async (base64Audio: string, mimeType: string, profile: UserProfile, imageBase64?: string): Promise<CapsuleAnalysis> => {
  const model = "models/gemini-flash-latest";

  try {
    const parts: any[] = [{ inlineData: { data: base64Audio, mimeType } }];
    if (imageBase64) {
      parts.push({ inlineData: { data: imageBase64, mimeType: "image/jpeg" } });
    }
    parts.push({ text: "Analyze this memory for my archive." });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction: getSystemInstruction(profile),
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA
      }
    });

    return JSON.parse(response.text || "{}") as CapsuleAnalysis;
  } catch (error) {
    console.error("Error analyzing voice note:", error);
    throw error;
  }
};

export const analyzeTextLog = async (text: string, profile: UserProfile): Promise<CapsuleAnalysis> => {
  const model = "models/gemini-flash-latest";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: `Analyze this text memory for my archive: "${text}"` }]
      },
      config: {
        systemInstruction: getSystemInstruction(profile),
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA
      }
    });

    return JSON.parse(response.text || "{}") as CapsuleAnalysis;
  } catch (error) {
    console.error("Error analyzing text log:", error);
    throw error;
  }
};

export const generateWeeklyLetter = async (entries: CapsuleEntry[], weekLabel: string, profile: UserProfile): Promise<WeeklyLetter> => {
  const model = "models/gemini-flash-latest";

  const historyText = entries
    .map(e => `[${new Date(e.timestamp).toDateString()}] Mood: ${e.mood}. Summary: ${e.summary}.`)
    .join('\n\n');

  const prompt = `Write a letter to ${profile.name}. Their current life focus is "${profile.northStar}".
  Review their week:
  ${historyText}

  Style: ${profile.persona}. 
  Find a common thread between their memories and their life focus.
  Return JSON with 'content' and 'themes'.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: getSystemInstruction(profile),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            themes: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["content", "themes"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      weekLabel,
      content: parsed.content,
      themes: parsed.themes
    };
  } catch (error) {
    console.error("Error generating weekly letter:", error);
    throw error;
  }
};

export const askTheArchive = async (query: string, history: string, profile: UserProfile): Promise<string> => {
  const model = "models/gemini-flash-latest";
  const prompt = `User ${profile.name} (Focus: ${profile.northStar}) asks: "${query}"\n\nArchive:\n${history}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: `You are The Capsule (${profile.persona} persona). Help the user find insights in their archive.`
      }
    });
    return response.text || "";
  } catch (error) {
    return "I'm having trouble searching right now.";
  }
};


