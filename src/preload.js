const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  loadModel: (model) => ipcRenderer.invoke("model-load", model),
  chat: (userMessage) => ipcRenderer.invoke("model-chat", userMessage),
  changeModel: () => ipcRenderer.send("model-change"),
  clearHistory: () => ipcRenderer.send("model-clear-history"),
  clipboardCopy: (content) => ipcRenderer.send("clipboard-copy", content),
  getModelInfo: () => ipcRenderer.invoke("model-info"),
  onModelChange: (callback) => ipcRenderer.on("model-changed", (_, arg) => callback(arg)),
});
