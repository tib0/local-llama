interface ImportMetaEnv {
  readonly VITE_LLAMA_MODELS_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

export interface IElectronAPI {
  changeModel: () => Promise<string>;
  changeModelGpuUse: (g: string) => Promise<void>;
  changeModelSystemPrompt: (p: string) => Promise<void>;
  changeTemperature: (t: number) => Promise<void>;
  chat: (p: string) => Promise<string>;
  clearHistory: () => Promise<void>;
  clipboardCopy: (c: string) => Promise<void>;
  getModelInfo: () => Promise<string>;
  loadHistory: () => Promise<any>;
  loadModel: (m?: string) => Promise<string>;
  onModelChange: (h: (modelPath?: string | undefined) => void) => Promise<void>;
  openExternalLink: (h) => Promise<void>;
  quitApp: () => Promise<void>;
  saveHistory: () => Promise<string>;
}
