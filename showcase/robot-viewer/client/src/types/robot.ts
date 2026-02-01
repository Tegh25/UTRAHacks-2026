/** Types for parts, voice, state, sound. */
export type PartCategory = 'motion' | 'sensors' | 'power' | 'control' | 'structure' | 'communication';

export interface RobotPart {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  category: PartCategory;
}

export interface ProcessedVoiceResponse {
  transcription: string;
  matchedParts: RobotPart[];
  confidence: number;
  reasoning: string;
}

export interface ApiStatus {
  demoMode: boolean;
  elevenlabsConfigured: boolean;
  geminiConfigured: boolean;
}

export interface RobotState extends SoundState {
  highlightedParts: string[];
  selectedPart: string | null;
  isLoading: boolean;
  lastTranscription: string | null;
  error: string | null;
  parts: RobotPart[];
  apiStatus: ApiStatus | null;
  explodeStrength: number;
  showGround: boolean;
  groundY: number;
  cameraMode: 'third' | 'first';
  tourActive: boolean;
}

export interface EngineSound {
  id: string;
  name: string;
  description: string;
  audioUrl?: string;
}

export interface SoundState {
  soundEnabled: boolean;
  soundVolume: number;
  selectedSound: EngineSound | null;
  availableSounds: EngineSound[];
  isLoadingSound: boolean;
  carSpeed: number;
  isCarMoving: boolean;
}

export interface SoundActions {
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setSelectedSound: (sound: EngineSound | null) => void;
  setAvailableSounds: (sounds: EngineSound[]) => void;
  setIsLoadingSound: (loading: boolean) => void;
  setCarSpeed: (speed: number) => void;
  setIsCarMoving: (moving: boolean) => void;
}

export interface RobotActions extends SoundActions {
  highlightParts: (partIds: string[]) => void;
  clearHighlights: () => void;
  selectPart: (partId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setTranscription: (text: string | null) => void;
  setError: (error: string | null) => void;
  setParts: (parts: RobotPart[]) => void;
  setApiStatus: (status: ApiStatus) => void;
  setExplodeStrength: (strength: number) => void;
  toggleGround: () => void;
  setGroundY: (y: number) => void;
  toggleCameraMode: () => void;
  setTourActive: (active: boolean) => void;
}
