interface ImportMetaEnv {
  readonly VITE_LLAMA_MODELS_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface IElectronAPI {
  loadPreferences: () => Promise<void>;
  loadModel: () => Promise<boolean>;
  chat: (p: string) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
