import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponse } from '../types/index.js';
import type { RobotPart } from '../types/index.js';
import { getPartsListForAI, getAllPartIds, robotParts } from '../config/robotParts.js';

let genAI: GoogleGenerativeAI | null = null;
let warnedNoDescriptionKey = false;

function getGenAI(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function identifyParts(query: string): Promise<GeminiResponse> {
  const ai = getGenAI();

  if (!ai) {
    console.log('[Gemini] No API key found, using mock matching');
    return mockIdentifyParts(query);
  }

  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a robot part identification assistant. Given a user query about a robot and a list of available robot parts, identify which parts are most relevant to the query.

Available robot parts:
${getPartsListForAI()}

User query: "${query}"

Respond with ONLY valid JSON (no markdown code fences). The format must be:
{"partIds": ["id1", "id2"], "confidence": 0.85, "reasoning": "Brief explanation of why these parts match"}

Rules:
- partIds must contain valid IDs from the list above
- confidence is 0.0 to 1.0
- Return 1-5 most relevant parts
- If no parts match, return empty partIds with low confidence`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Extract JSON from possible markdown fencing
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse Gemini response as JSON');
  }

  const parsed: GeminiResponse = JSON.parse(jsonMatch[0]);
  const validIds = getAllPartIds();
  parsed.partIds = parsed.partIds.filter((id) => validIds.includes(id));

  return parsed;
}

function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace > 60) {
    return slice.slice(0, lastSpace).trim();
  }
  return slice.trim();
}

function sanitizeDescription(text: string): string {
  let cleaned = text.replace(/```[\s\S]*?```/g, '').trim();
  cleaned = cleaned.replace(/^description\s*[:\-]\s*/i, '');
  cleaned = cleaned.replace(/^(?:\d+\.\s+|-+\s+)/, '');
  cleaned = cleaned.replace(/^[\s"'`]+|[\s"'`]+$/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return truncateAtWord(cleaned, 200);
}

export async function generatePartDescription(part: RobotPart): Promise<string | null> {
  const ai = getGenAI();

  if (!ai) {
    if (!warnedNoDescriptionKey) {
      console.log('[Gemini] No API key found, skipping description generation');
      warnedNoDescriptionKey = true;
    }
    return null;
  }

  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You write concise UI descriptions for robot parts. Use the provided info and keep it factual.
Write 1 short sentence (max 20 words). No quotes, no labels, no bullet points.

Part info:
- ID: ${part.id}
- Name: ${part.name}
- Category: ${part.category}
- Keywords: ${part.keywords.join(', ') || 'none'}
- Functional role: ${part.functionalRole || 'none'}
- Related parts: ${part.relatedTo?.join(', ') || 'none'}

Return ONLY the description text.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = sanitizeDescription(text);
  return cleaned || null;
}

export function mockIdentifyParts(query: string): GeminiResponse {
  const stopWords = new Set(['the', 'is', 'are', 'was', 'were', 'what', 'where', 'which', 'who', 'how', 'that', 'this', 'for', 'and', 'but', 'not', 'with', 'has', 'have', 'show', 'find', 'get', 'can', 'does', 'part', 'parts', 'robot', 'highlight', 'me']);
  const queryLower = query.toLowerCase().replace(/[?!.,]/g, '');
  const matched: { id: string; score: number }[] = [];

  for (const part of robotParts) {
    const keywordsStr = part.keywords.join(' ').toLowerCase();
    const nameStr = part.name.toLowerCase();

    const queryWords = queryLower.split(/\s+/);
    const matchCount = queryWords.filter(
      (word) => word.length > 2 && !stopWords.has(word) && (keywordsStr.includes(word) || nameStr.includes(word))
    ).length;

    if (matchCount > 0) {
      matched.push({ id: part.id, score: matchCount });
    }
  }

  matched.sort((a, b) => b.score - a.score);

  // If nothing matched, pick a random part for demo purposes
  if (matched.length === 0) {
    const randomPart = robotParts[Math.floor(Math.random() * robotParts.length)];
    matched.push({ id: randomPart.id, score: 0 });
  }

  return {
    partIds: matched.slice(0, 5).map((m) => m.id),
    confidence: matched[0]?.score > 0 ? 0.7 : 0.3,
    reasoning: `Demo mode: Matched ${matched.length} part(s) via keyword search.`,
  };
}
