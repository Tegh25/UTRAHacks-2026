import axios from 'axios';
import FormData from 'form-data';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

const sampleQueries = [
  'Show me the part that controls the speed',
  'Where is the main battery?',
  'Highlight the camera sensor',
  'What part handles wireless communication?',
  'Show me the robot brain',
  'Which parts are responsible for movement?',
  'Find the power distribution system',
  'Where is the lidar sensor?',
  'Show me the arm actuator',
];

export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string
): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.log('[ElevenLabs] No API key found, using mock transcription');
    return mockTranscribe();
  }

  const form = new FormData();
  const ext = mimeType.includes('webm') ? 'webm' : 'wav';
  form.append('file', audioBuffer, {
    filename: `recording.${ext}`,
    contentType: mimeType,
  });
  form.append('model_id', 'scribe_v1');

  const response = await axios.post(ELEVENLABS_API_URL, form, {
    headers: {
      'xi-api-key': apiKey,
      ...form.getHeaders(),
    },
  });

  return response.data.text;
}

export function mockTranscribe(): string {
  return sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
}
