import type { GeminiRequest, GeminiResponse } from '@/lib/types';

/**
 * Call Gemini API through our secure server-side proxy
 */
export async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const request: GeminiRequest = {
    prompt: {
      system: systemPrompt,
      user: userPrompt,
    },
    model: options?.model || 'gemini-2.0-flash-exp',
    maxTokens: options?.maxTokens || 2048,
    temperature: options?.temperature ?? 0.1,
  };

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Gemini API call failed');
  }

  const data: GeminiResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * Parse JSON response from Gemini (handles markdown code blocks)
 */
export function parseGeminiJSON<T>(response: string): T {
  // Remove markdown code blocks if present
  let cleaned = response.trim();
  
  // Remove ```json and ``` markers
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?\n/, '').replace(/\n```$/, '');
  }
  
  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error('Failed to parse Gemini response:', cleaned);
    throw new Error('Invalid JSON response from Gemini');
  }
}

/**
 * Chunk large text for processing
 */
export function chunkText(text: string, maxChunkSize: number = 2000): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  const lines = text.split('\n');
  
  for (const line of lines) {
    if ((currentChunk + line).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = line + '\n';
    } else {
      currentChunk += line + '\n';
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

/**
 * Process large text in chunks with Gemini
 */
export async function processInChunks(
  text: string,
  systemPrompt: string,
  chunkSize: number = 2000
): Promise<string[]> {
  const chunks = chunkText(text, chunkSize);
  const results: string[] = [];
  
  for (const chunk of chunks) {
    const result = await callGemini(systemPrompt, chunk);
    results.push(result);
  }
  
  return results;
}
