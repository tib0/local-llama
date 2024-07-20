const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  abortPrompt: () => ipcRenderer.send("abort-prompt"),
  changeModel: () => ipcRenderer.send("model-change"),
  changeModelGpuUse: (useGpu) => ipcRenderer.send("model-change-gpu-use", useGpu),
  changeModelSystemPrompt: (systemPrompt) =>
    ipcRenderer.send("model-change-system-prompt", systemPrompt),
  changeTemperature: (temperature) =>
    ipcRenderer.send("model-change-temperature", temperature),
  chat: (userMessage) => ipcRenderer.invoke("model-chat", userMessage),
  clearHistory: () => ipcRenderer.send("model-clear-history"),
  clipboardCopy: (content) => ipcRenderer.send("clipboard-copy", content),
  getModelInfo: () => ipcRenderer.invoke("model-info"),
  loadHistory: () => ipcRenderer.invoke("model-load-history"),
  loadModel: (model) => ipcRenderer.invoke("model-load", model),
  onModelChange: (callback) => ipcRenderer.on("model-changed", (_, arg) => callback(arg)),
  onChunkReceive: (callback) => ipcRenderer.on("chunk-received", (_, arg) => callback(arg)),
  openExternalLink: (href) => ipcRenderer.send("open-external-link", href),
  quitApp: () => ipcRenderer.invoke("quit-app"),
  saveHistory: () => ipcRenderer.invoke("model-save-history"),
});
