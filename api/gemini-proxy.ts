
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.VITE_API_KEY || process.env.API_KEY }); // Vercel uses process.env

export const config = {
    runtime: 'edge', // Use Edge runtime for faster cold starts if compatible, or default
};

// Vercel Serverless Function
export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { contents, config, model } = await request.json();

        if (!contents) {
            return new Response(JSON.stringify({ error: 'Missing contents' }), { status: 400 });
        }

        const response = await ai.models.generateContent({
            model: model || 'models/gemini-flash-latest',
            contents,
            config
        });

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error }), { status: 500 });
    }
}
