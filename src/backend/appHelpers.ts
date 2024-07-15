import type Store from "electron-store";
import fs from "fs";
import path from "path";

export function initFolder(
  store: Store<Record<string, unknown>>,
  path: string,
  name: string,
): void {
  try {
    const modelDir = store.get(name);
    if (!modelDir || !fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
      store.set(name, path ?? "");
    }
  } catch (e) {
    console.error(e);
  }
}

function getAvailableModels(modelDir: string | undefined, fileExtension: string) {
  return modelDir && modelDir !== "" && fs.existsSync(modelDir)
    ? fs
        .readdirSync(modelDir, { withFileTypes: true })
        .filter((item) => !item.isDirectory())
        .filter((item) => item.name.includes("." + fileExtension))
        .map((item) => path.join(modelDir, item.name))
    : [];
}

export function initSelectedModel(
  store: Store<Record<string, unknown>>,
  modelDir: string | undefined,
  storeName: string,
  modelFileExtension: string,
): void {
  try {
    const availableModels = getAvailableModels(modelDir, modelFileExtension);
    const storeValue = store.get(storeName) as string;
    if (!store.get(storeName) || !fs.existsSync(path.join(storeValue))) {
      if (availableModels.length === 0 || !fs.existsSync(availableModels[0])) {
        store.set(storeName, "");
      } else {
        store.set(storeName, availableModels[0] ?? "");
      }
    }
  } catch (e) {
    console.error(e);
  }
}

export function initStoreValue(
  store: Store<Record<string, unknown>>,
  storeName: string,
  defaultValue: string | unknown,
): void {
  if (!store.get(storeName)) {
    store.set(storeName, defaultValue);
  }
}
