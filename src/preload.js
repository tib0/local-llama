const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  loadModel: () => ipcRenderer.invoke("model-load"),
  chat: (userMessage) => ipcRenderer.invoke("model-chat", userMessage),
  sampleStream: async (message, callback) => {
    ipcRenderer.on("stream-reply", (_, arg) => callback(arg));
    await ipcRenderer.send("stream-sample", message);
  },
});
