import { BrowserWindow, app, ipcMain, net, protocol } from "electron";
import Store from "electron-store";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { LlamaWrapper } from "./frontend/lib/llamaNodeCppWrapper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptSystem = `
  Tu parles français.
  Celui qui te parles est "l'interlocuteur".
  Cette règle est la plus importante : tu dois être concis, tes réponses ne doivent pas être longues.
  Si possible, répond par un seul mot à une question.
  Si il est possible de répondre par un seul mot à une question répond par cet unique mot.
  Tu es humble, si tu ne connais pas la réponse à une question exprime le clairement et demande des précisions pour t'aider à comprendre la question.
  Tu es perspicace, si tu ne connais pas la réponse à une question donne des pistes de réflexion pour obtenir une réponse ailleur.
  Si une conversation est supérieur à deux échanges intégre parfois dans tes réponses des questions pour mieux comprendre qui est ton "l'interlocuteur" si cela est nécessaire.
`;

const llamaNodeCPP = new LlamaWrapper();

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { bypassCSP: true } }]);

app.whenReady().then(() => {
  protocol.handle("app", (req) => {
    const { pathname } = new URL(req.url);
    return net.fetch(pathToFileURL(pathname).toString());
  });
});

const store = new Store();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
};

app.on("ready", createWindow);

ipcMain.handle("model-load", loadModel);

ipcMain.handle("model-chat", chat);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const modelDir = store.get("model_dir");
if (!modelDir) {
  const defaultModelDir = path.join(os.homedir(), ".cache/local-llama");
  fs.mkdirSync(defaultModelDir, { recursive: true });
  store.set("model_dir", defaultModelDir);
}

async function loadModel() {
  const modelDir = store.get("model_dir");
  if (!modelDir) {
    return false;
  }

  if (!llamaNodeCPP.isReady()) {
    await llamaNodeCPP.loadModule();
    await llamaNodeCPP.loadLlama();
    await llamaNodeCPP.loadModel(import.meta.env["VITE_LLAMA_MODELS_PATH"]);
    await llamaNodeCPP.initSession(promptSystem);
  }
  return true;
}

async function chat(_event, userMessage) {
  let c;
  if (llamaNodeCPP.isReady()) {
    console.debug(`prompt-llama User said: ${userMessage}`);
    c = await llamaNodeCPP.prompt(userMessage);
    console.debug(`prompt-llama Llama answered: ${c}`);
  }
  return c ?? "No response";
}
