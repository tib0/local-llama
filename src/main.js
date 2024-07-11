import { app } from "electron";
import path from "path";
import { spawn as cpSpawn } from "child_process";

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const appFolder = path.resolve(process.execPath, "..");
  const rootAtomFolder = path.resolve(appFolder, "..");
  const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
  const exeName = path.basename(process.execPath);

  const spawn = function (command, args) {
    let spawnedProcess;

    try {
      spawnedProcess = cpSpawn(command, args, { detached: true });
    } catch (error) {
      console.error(error);
    }

    return spawnedProcess;
  };

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];

  switch (squirrelEvent) {
    case "--squirrel-install":
    case "--squirrel-updated":
      spawnUpdate(["--createShortcut", exeName]);
      return true;
    case "--squirrel-uninstall":
      spawnUpdate(["--removeShortcut", exeName]);
      return true;
    case "--squirrel-obsolete":
      return true;
  }
}

if (handleSquirrelEvent()) {
  app.quit();
}

import {
  Menu,
  BrowserWindow,
  ipcMain,
  net,
  protocol,
  dialog,
  clipboard,
  shell,
} from "electron";
import Store from "electron-store";
import fs from "fs";
import os from "os";
import { fileURLToPath, pathToFileURL } from "url";
import { LlamaWrapper } from "./frontend/lib/llamaNodeCppWrapper";
import { appMenu, appContextMenu, winBounds } from "./backend/appConfig";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cache = path.join(os.homedir(), ".cache/local-llama");
const modelsFolder = path.join(cache, "models");
const historyFolder = path.join(cache, "history");
const logsFolder = path.join(cache, "logs");

const store = new Store();

let llamaNodeCPP = new LlamaWrapper();

let isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
}

const modelDir = store.get("model_dir");
if (!modelDir || !fs.existsSync(modelsFolder)) {
  const defaultModelDir = modelsFolder;
  fs.mkdirSync(defaultModelDir, { recursive: true });
  store.set("model_dir", defaultModelDir ?? "");
}

const logDir = store.get("log_dir");
if (!logDir || !fs.existsSync(logsFolder)) {
  const defaultLogDir = logsFolder;
  fs.mkdirSync(defaultLogDir, { recursive: true });
  store.set("log_dir", defaultLogDir ?? "");
}

const historyDir = store.get("history_dir");
if (!historyDir || !fs.existsSync(historyFolder)) {
  const defaultHistoryDir = historyFolder;
  fs.mkdirSync(defaultHistoryDir, { recursive: true });
  store.set("history_dir", defaultHistoryDir ?? "");
}

const promptSystem = `You are an assistant to a human being.`;

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { bypassCSP: true } }]);

const availableModels = fs
  .readdirSync(modelDir, { withFileTypes: true })
  .filter((item) => !item.isDirectory())
  .filter((item) => item.name.includes(".gguf"))
  .map((item) => path.join(modelDir, item.name));

if (!store.get("selected_model") || !fs.existsSync(store.get("selected_model"))) {
  if (availableModels.length === 0 || !fs.existsSync(availableModels[0])) {
    store.set("selected_model", "");
  }
  store.set("selected_model", availableModels[0] ?? "");
}

if (!store.get("gpu")) {
  store.set("gpu", "auto");
}

if (!store.get("temperature")) {
  store.set("temperature", 0);
}

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
    width: 450,
    height: 682,
    show: false,
    frame: false,
    hasShadow: true,
    movable: true,
    resizable: true,
    maximizable: true,
    minimizable: true,
  });

  mainWindow.setBounds(winBounds(store));

  const splash = new BrowserWindow({
    width: 225,
    height: 340,
    frame: false,
    hasShadow: true,
    center: true,
    movable: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    backgroundColor: "#00000000",
    vibrancy: "popover",
    visualEffectState: "followWindow",
    backgroundMaterial: "acrylic",
  });

  // eslint-disable-next-line no-undef
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // eslint-disable-next-line no-undef
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      // eslint-disable-next-line no-undef
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

  app.on("second-instance", (_event, _argv, _cwd) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  mainWindow.webContents.on("context-menu", (_event, params) => {
    appContextMenu(params, mainWindow);
  });

  function showFunc() {
    mainWindow.once("ready-to-show", () => {
      setTimeout(async function () {
        await loadModel();
        llamaNodeCPP.temperature = store.get("temperature");
        splash.destroy();
        mainWindow.show();
      }, 3000);
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(store)));

  showFunc();
};

app.on("ready", createWindow);

ipcMain.handle("model-load", loadModel);

ipcMain.handle("model-chat", chat);

ipcMain.handle("model-info", getModelInfo);

ipcMain.handle("model-save-history", saveHistory);

ipcMain.handle("model-load-history", loadHistory);

ipcMain.handle("quit-app", quitApp);

ipcMain.on("model-change", changeModel);

ipcMain.on("model-change-gpu-use", changeModelGpuUse);

ipcMain.on("model-change-system-prompt", changeModelSystemPrompt);

ipcMain.on("model-change-temperature", changeTemperature);

ipcMain.on("model-clear-history", clearHistory);

ipcMain.on("open-external-link", openExternalLink);

ipcMain.on("clipboard-copy", clipboardCopy);

app.on("window-all-closed", () => {
  llamaNodeCPP.disposeModel();
  llamaNodeCPP.disposeSession();
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

async function openExternalLink(_event, href) {
  shell.openExternal(href);
}

async function loadModel(_event, modelPath) {
  const selectedModelPath = modelPath ?? store.get("selected_model");

  if (!selectedModelPath || !fs.existsSync(selectedModelPath)) {
    return "";
  }

  if (!llamaNodeCPP.isReady()) {
    await llamaNodeCPP.loadModule();
    await llamaNodeCPP.loadLlama(store.get("gpu") === "false" ? false : store.get("gpu"));
  }

  if (
    llamaNodeCPP.isReady() &&
    (await llamaNodeCPP.getInfos()).model !== undefined &&
    selectedModelPath.includes((await llamaNodeCPP.getInfos()).model?.filename) &&
    store.get("gpu") === (await llamaNodeCPP.getInfos()).model?.gpu
  ) {
    return selectedModelPath;
  }

  if (llamaNodeCPP.isReady() && (await llamaNodeCPP.getInfos()).context !== undefined) {
    llamaNodeCPP.clearHistory();
    await llamaNodeCPP.disposeModel();
    await llamaNodeCPP.disposeSession();
    await llamaNodeCPP.disposeLlama();
    await llamaNodeCPP.loadLlama(store.get("gpu") === "false" ? false : store.get("gpu"));
  }
  await llamaNodeCPP.loadModel(selectedModelPath);
  await llamaNodeCPP.initSession(store.get("prompt_system") ?? promptSystem);

  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send("model-changed", selectedModelPath);
  }

  store.set("selected_model", selectedModelPath ?? "");

  if (llamaNodeCPP.isReady()) {
    return selectedModelPath;
  } else {
    store.set("selected_model", selectedModelPath ?? "");
    store.set("gpu", "auto");
    return "";
  }
}

async function saveHistory(_event) {
  const date = new Date();
  const defaultFileName = `${date.toISOString().replaceAll(":", "-")}.lllh`;
  const result = await dialog.showSaveDialog({
    title: "Save file as",
    defaultPath: path.join(store.get("history_dir"), defaultFileName),
    filters: [
      {
        name: "Conversation history",
        extensions: ["lllh"],
      },
    ],
  });

  if (!result || result.canceled) return "";

  try {
    const history = await llamaNodeCPP.getHistory();
    const conversation = {
      history: history,
      model_path: store.get("selected_model"),
      prompt_system: store.get("prompt_system"),
      gpu: store.get("gpu"),
      temperature: store.get("temperature"),
    };
    fs.writeFileSync(result.filePath, JSON.stringify(conversation), "utf-8");
  } catch (e) {
    console.log(e, result);
    return "";
  }

  return result.filePath;
}

async function loadHistory(_event) {
  let historyParm;
  const result = await dialog.showOpenDialog({
    filters: [
      {
        name: "Conversation history",
        extensions: ["lllh"],
      },
    ],
    title: "Load history from...",
    defaultPath: store.get("history_dir"),
    properties: ["openFile"],
  });
  if (!result || result.canceled) return;
  try {
    historyParm = JSON.parse(fs.readFileSync(result.filePaths[0], "utf-8"));
  } catch (e) {
    console.log(e);
    return;
  }

  try {
    store.set("selected_model", historyParm.model_path ?? "");
    store.set("prompt_system", historyParm.prompt_system ?? "");
    store.set("gpu", historyParm.gpu ?? "");
    store.set("temperature", historyParm.temperature ?? "");

    llamaNodeCPP.temperature = store.get("temperature");

    llamaNodeCPP.clearHistory();
    await llamaNodeCPP.disposeSession();
    await llamaNodeCPP.disposeModel();
    await llamaNodeCPP.disposeLlama();

    await loadModel();
    await llamaNodeCPP.setHistory(historyParm.history);
    return historyParm.history;
  } catch (e) {
    console.log(e, result);
    return;
  }
}

async function changeModelGpuUse(_event, gpuUse) {
  store.set("gpu", gpuUse);
  llamaNodeCPP.clearHistory();
  await llamaNodeCPP.disposeSession();
  await llamaNodeCPP.disposeModel();
  await llamaNodeCPP.disposeLlama();
  await loadModel();
}

async function changeModelSystemPrompt(_event, promptSystem) {
  store.set("prompt_system", promptSystem);
  llamaNodeCPP.clearHistory();
  await llamaNodeCPP.disposeSession();
  await llamaNodeCPP.disposeModel();
  await llamaNodeCPP.disposeLlama();
  await loadModel();
}

async function changeTemperature(_event, temperature) {
  store.set("temperature", temperature);
}

async function quitApp(_event) {
  app.quit();
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
  const temp = store.get("temperature");
  const c = await llamaNodeCPP.prompt(userMessage, undefined, {
    temperature: temp,
  });
  return c ?? "No response";
}

async function changeModel() {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Models", extensions: ["gguf"] }],
    defaultPath: store.get("model_dir"),
    properties: ["openFile"],
  });
  if (filePaths === undefined || filePaths?.length < 1 || !fs.existsSync(filePaths[0])) {
    return;
  }
  await loadModel(undefined, filePaths[0]);
}
