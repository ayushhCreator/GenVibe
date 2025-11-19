export interface GeneratedImage {
  id: string;
  base64: string;
  prompt: string;
  createdAt: number;
}

export interface GenerationState {
  loading: boolean;
  error: string | null;
}

export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:3' | '3:4';
