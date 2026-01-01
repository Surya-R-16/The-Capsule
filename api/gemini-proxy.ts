
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_API_KEY || process.env.API_KEY;

if (!apiKey) {
    console.error("DEBUG: API Key is missing. Available env vars:", Object.keys(process.env).filter(k => k.includes('API') || k.includes('KEY')));
}

const ai = new GoogleGenAI({ apiKey: apiKey || "dummy_key_to_prevent_init_crash" }); // Prevent crash on init, fail on call instead if missing

export const config = {
    // runtime: 'edge', // Edge can be tricky with some SDKs. Switching to Node for stability.
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
    } catch (error: any) {
        console.error('API Error:', error);

        // Return helpful debug info to client
        if (error.message?.includes('API Key')) {
            return new Response(JSON.stringify({
                error: 'Configuration Error: API Key is missing on the server.',
                details: 'Please add GEMINI_API_KEY to Vercel Environment Variables.'
            }), { status: 500 });
        }

        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message || error }), { status: 500 });
    }
}
