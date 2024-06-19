import { Menu, BrowserWindow, app, ipcMain, net, protocol, dialog, clipboard } from "electron";
import Store from "electron-store";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { LlamaWrapper } from "./frontend/lib/llamaNodeCppWrapper";
import { appMenu, appContextMenu, winBounds } from "./Backend/appConfig";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __cache = path.join(os.homedir(), ".cache/local-llama");
const __modelsFolder = path.join(__cache, "models");
const __logsFolder = path.join(__cache, "logs");

let llamaNodeCPP = new LlamaWrapper();
const store = new Store();

const modelDir = store.get("model_dir");
if (!modelDir || !fs.existsSync(__modelsFolder)) {
  const defaultModelDir = __modelsFolder;
  fs.mkdirSync(defaultModelDir, { recursive: true });
  store.set("model_dir", defaultModelDir);
}

const logDir = store.get("log_dir");
if (!logDir || !fs.existsSync(__logsFolder)) {
  const defaultLogDir = __logsFolder;
  fs.mkdirSync(defaultLogDir, { recursive: true });
  store.set("log_dir", defaultLogDir);
}

let promptSystem = `
  Tu parles français.
  Celui qui te parles est "l'interlocuteur".
  Cette règle est la plus importante : tu dois être concis, tes réponses ne doivent pas être longues.
  Si il est possible de répondre par un seul mot à une question répond par cet unique mot.
  Tu es humble, si tu ne connais pas la réponse à une question exprime le clairement et demande des précisions pour t'aider à comprendre la question.
  Tu es perspicace, si tu ne connais pas la réponse à une question donne des pistes de réflexion pour obtenir une réponse ailleur.
  Si une conversation est supérieur à deux échanges intégre parfois dans tes réponses des questions pour mieux comprendre qui est ton "l'interlocuteur" si cela est nécessaire.
`;

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { bypassCSP: true } }]);

const availableModels = fs
  .readdirSync(modelDir, { withFileTypes: true })
  .filter((item) => !item.isDirectory())
  .filter((item) => item.name.includes(".gguf"))
  .map((item) => path.join(modelDir, item.name));

app.whenReady().then(() => {
  protocol.handle("app", (req) => {
    const { pathname } = new URL(req.url);
    return net.fetch(pathToFileURL(pathname).toString());
  });
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
  });

  mainWindow.setBounds(winBounds(store));

  const splash = new BrowserWindow({
    width: 275,
    height: 350,
    transparent: true,
    frame: false,
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  splash.loadFile(`splash.html`);

  mainWindow.on("close", () => {
    store.set("winBounds", {
      isMaximized: mainWindow.isMaximized(),
      ...mainWindow.getNormalBounds(),
    });
  });

  mainWindow.webContents.on("context-menu", (_event, params) => {
    appContextMenu(params, mainWindow);
  });

  function showFunc() {
    mainWindow.once("ready-to-show", () => {
      setTimeout(async function () {
        await loadModel();
        splash.destroy();
        mainWindow.show();
      }, 1500);
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(store)));

  showFunc();
};

app.on("ready", createWindow);

ipcMain.handle("model-load", loadModel);

ipcMain.handle("model-chat", chat);

ipcMain.handle("model-info", getModelInfo);

ipcMain.on("model-change", changeModel);

ipcMain.on("model-clear-history", clearHistory);

ipcMain.on("clipboard-copy", clipboardCopy);

app.on("window-all-closed", () => {
  llamaNodeCPP = undefined;
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

async function clipboardCopy(_event, content) {
  clipboard.writeText(content, "clipboard");
}

async function loadModel(_event, modelPath) {
  const modelDir = store.get("model_dir");
  if (!modelDir) {
    return "";
  }

  const selectedModelPath =
    modelPath ?? availableModels[0] ?? import.meta.env["VITE_LLAMA_MODELS_PATH"];

  if (!selectedModelPath || !fs.existsSync(selectedModelPath)) {
    return "";
  }

  if (!llamaNodeCPP.isReady()) {
    await llamaNodeCPP.loadModule();
    await llamaNodeCPP.loadLlama();
  }

  if (
    llamaNodeCPP.isReady() &&
    (await llamaNodeCPP.getInfos()).model !== undefined &&
    selectedModelPath.includes((await llamaNodeCPP.getInfos()).model?.filename)
  ) {
    return selectedModelPath;
  }

  if (llamaNodeCPP.isReady() && (await llamaNodeCPP.getInfos()).context !== undefined) {
    await llamaNodeCPP.disposeModel();
    await llamaNodeCPP.disposeSession();
  }

  await llamaNodeCPP.loadModel(selectedModelPath);
  await llamaNodeCPP.initSession(promptSystem);

  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send("model-changed", selectedModelPath);
  }
  return selectedModelPath;
}

async function clearHistory() {
  if (llamaNodeCPP.isReady() && (await llamaNodeCPP.getInfos()).context !== undefined) {
    llamaNodeCPP.clearHistory();
  }
}

async function getModelInfo() {
  const i = await llamaNodeCPP.getInfos();
  return JSON.stringify(i);
}

async function chat(_event, userMessage) {
  if (!llamaNodeCPP.isReady()) {
    return "No response";
  }
  const c = await llamaNodeCPP.prompt(userMessage);
  return c ?? "No response";
}

async function changeModel() {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Models", extensions: ["gguf"] }],
    properties: ["openFile"],
  });
  if (filePaths === undefined || filePaths?.length < 1 || !fs.existsSync(filePaths[0])) {
    return;
  }
  await loadModel(undefined, filePaths[0]);
}
