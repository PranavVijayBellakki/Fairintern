import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

async function listModels() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("--- START LISTING ---");
    const iterable = await ai.models.list();
    let count = 0;
    for await (const model of iterable) {
      count++;
      console.log(`MODEL_${count}: ${model.name}`);
      // @ts-ignore
      if (model.supportedGenerationMethods) {
         // @ts-ignore
         console.log(`  METHODS: ${JSON.stringify(model.supportedGenerationMethods)}`);
      }
    }
    console.log(`--- TOTAL MODELS: ${count} ---`);
  } catch (error) {
    console.error("--- ERROR ---");
    console.error(error);
  }
}

listModels();
