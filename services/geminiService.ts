
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeBoardImage = async (base64Image: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Analyze this chess board screenshot. 
  1. Identify the current position of all pieces.
  2. Determine whose turn it is (assume White if not clear, but look for UI indicators).
  3. Suggest the single best move in standard algebraic notation (e.g., "Nf3", "O-O", "exd5").
  4. Provide a brief strategic explanation.
  5. Give a rough evaluation (e.g., +1.2, -0.5, Mate in 3).
  6. Provide a sequence of the next 3-5 calculated best moves (the main line) as an array of strings.
  Return the response in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bestMove: { type: Type.STRING },
          explanation: { type: Type.STRING },
          evaluation: { type: Type.STRING },
          steps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Sequence of calculated next moves (e.g. ['Nf3', 'd5', 'c4'])"
          },
          detectedPosition: { type: Type.STRING, description: "The position in FEN notation if possible" }
        },
        required: ["bestMove", "explanation", "evaluation", "steps"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as AnalysisResult;
};
