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
  loadModel: (m?: string) => Promise<boolean>;
  chat: (p: string) => Promise<string>;
  changeModel: () => Promise<string>;
  clearHistory: () => Promise<void>;
  onModelChange: (h: (modelPath?: string | undefined) => void) => Promise<void>;
}
