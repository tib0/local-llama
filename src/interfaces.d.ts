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
  loadPreferences: () => Promise<void>;
  loadModel: () => Promise<boolean>;
  chat: (p: string) => Promise<string>;
}
