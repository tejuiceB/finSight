import { NextRequest, NextResponse } from 'next/server';
import type { GeminiRequest } from '@/lib/types';

/**
 * Secure server-side API route for Gemini API calls
 * Keeps API key on server, never exposed to client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GeminiRequest;
    const { prompt, model = 'gemini-2.0-flash-exp', maxTokens = 2048, temperature = 0.1 } = body;

    // Validate API key exists
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: GEMINI_API_KEY not set' },
        { status: 500 }
      );
    }

    // Validate request
    if (!prompt || !prompt.system || !prompt.user) {
      return NextResponse.json(
        { error: 'Invalid request: prompt.system and prompt.user are required' },
        { status: 400 }
      );
    }

    // Call Google Gemini API using OpenAI-compatible endpoint
    // Using Google AI Studio endpoint format
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    
    const geminiRequest = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${prompt.system}\n\n${prompt.user}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: maxTokens,
        topP: 0.95,
        topK: 40,
      },
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return NextResponse.json(
        { error: 'Gemini API call failed', details: errorText },
        { status: response.status }
      );
    }

    const geminiResponse = await response.json();
    
    // Transform Gemini response to OpenAI-compatible format
    const transformedResponse = {
      choices: [
        {
          message: {
            role: 'assistant',
            content: geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || '',
          },
        },
      ],
      usage: {
        prompt_tokens: geminiResponse.usageMetadata?.promptTokenCount || 0,
        completion_tokens: geminiResponse.usageMetadata?.candidatesTokenCount || 0,
        total_tokens: geminiResponse.usageMetadata?.totalTokenCount || 0,
      },
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('Gemini API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET method for health check
 */
export async function GET() {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  return NextResponse.json({
    status: 'ok',
    apiKeyConfigured: hasApiKey,
    message: hasApiKey
      ? 'Gemini API is ready'
      : 'GEMINI_API_KEY not configured - set in .env.local',
  });
}
