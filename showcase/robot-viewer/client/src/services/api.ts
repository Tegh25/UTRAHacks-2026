/** Backend calls: voice, parts, status, sounds. */
import axios from 'axios';
import type { ProcessedVoiceResponse, RobotPart, ApiStatus, EngineSound } from '../types/robot';

const baseURL = import.meta.env.VITE_API_URL ?? '/api';
const client = axios.create({ baseURL });

export async function processVoiceCommand(audioBlob: Blob): Promise<ProcessedVoiceResponse> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  const { data } = await client.post('/voice/process', formData);
  return data;
}

export async function processTextQuery(query: string): Promise<ProcessedVoiceResponse> {
  const { data } = await client.post('/voice/query', { query });
  return data;
}

// Load parts without AI description generation to avoid many Gemini calls on page load
export async function getAllParts(): Promise<RobotPart[]> {
  const { data } = await client.get('/parts');
  return data.parts;
}

export async function getPartDetails(
  partId: string
): Promise<{ part: RobotPart; relatedParts: RobotPart[] }> {
  const { data } = await client.get(`/parts/${partId}`);
  return data;
}

export async function searchParts(query: string): Promise<RobotPart[]> {
  const { data } = await client.get('/parts/search', { params: { q: query } });
  return data.parts;
}

export async function getApiStatus(): Promise<ApiStatus> {
  const { data } = await client.get('/voice/status');
  return data;
}

export async function getAvailableSounds(): Promise<EngineSound[]> {
  const { data } = await client.get('/sounds');
  return data.sounds;
}

export async function generateSound(soundId: string, duration: number = 2): Promise<Blob> {
  const { data } = await client.post(`/sounds/generate/${soundId}`, { duration }, {
    responseType: 'blob',
  });
  return data;
}
