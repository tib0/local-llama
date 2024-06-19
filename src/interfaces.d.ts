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
  loadModel: (m?: string) => Promise<string>;
  chat: (p: string) => Promise<string>;
  changeModel: () => Promise<string>;
  clearHistory: () => Promise<void>;
  clipboardCopy: (c: string) => Promise<void>;
  getModelInfo: () => Promise<string>;
  onModelChange: (h: (modelPath?: string | undefined) => void) => Promise<void>;
}
