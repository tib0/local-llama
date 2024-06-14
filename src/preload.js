const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  loadModel: () => ipcRenderer.invoke("model-load"),
  chat: (userMessage) => ipcRenderer.invoke("model-chat", userMessage),
});
