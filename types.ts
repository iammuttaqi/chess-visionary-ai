
export interface AnalysisResult {
  bestMove: string;
  explanation: string;
  evaluation: string;
  steps: string[];
  detectedPosition?: string; // FEN if possible
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  READY = 'READY',
  ERROR = 'ERROR'
}

export interface VoiceMessage {
  role: 'user' | 'model';
  text: string;
}
