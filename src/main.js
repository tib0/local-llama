import { app } from "electron";
import { handleSquirrelEvent } from "./backend/windowsSquirelInstallEvent";

if (handleSquirrelEvent() || !app.requestSingleInstanceLock()) {
  app.quit();
}

import {
  BrowserWindow,
  Menu,
  clipboard,
  dialog,
  ipcMain,
  net,
  protocol,
  shell,
} from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import Store from "electron-store";
import { fileURLToPath, pathToFileURL } from "url";
import { LlamaWrapper } from "./frontend/lib/llamaNodeCppWrapper";
import { appContextMenu, appMenu, promptSystem, winBounds } from "./backend/appConfig";
import { initFolder, initSelectedModel, initStoreValue } from "./backend/appHelpers";
import { mainWindowOptions } from "./backend/appConfig";
import { splashWindowOptions } from "./backend/appConfig";

const store = new Store();

let llamaNodeCPP = new LlamaWrapper();

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { bypassCSP: true } }]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cache = path.join(os.homedir(), ".cache/local-llama");

const modelsFolderName = "models";
const historyFolderName = "history";
const logsFolderName = "logs";
const seletedModelName = "selected_model";
const gpuName = "gpu";
const temperatureName = "temperature";
const systemPromptName = "prompt_system";

const defaultGPU = "auto";
const defaultTemperature = 0;

const historyFileExtension = "lllh";
const modelFileExtension = "gguf";

const modelsFolderPath = path.join(cache, modelsFolderName);
const historyFolderPath = path.join(cache, historyFolderName);
const logsFolderPath = path.join(cache, logsFolderName);

initFolder(store, modelsFolderPath, modelsFolderName);
initFolder(store, historyFolderPath, historyFolderName);
initFolder(store, logsFolderPath, logsFolderName);

initSelectedModel(store, modelsFolderPath, seletedModelName, modelFileExtension);
initStoreValue(store, gpuName, defaultGPU);
initStoreValue(store, temperatureName, defaultTemperature);

const createWindow = () => {
  const mainWindow = new BrowserWindow(mainWindowOptions(__dirname));
  const splash = new BrowserWindow(splashWindowOptions);

  mainWindow.setBounds(winBounds(store));

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

  function showWindow() {
    mainWindow.once("ready-to-show", () => {
      setTimeout(async function () {
        await loadModel();
        llamaNodeCPP.temperature = store.get(temperatureName);
        splash.destroy();
        mainWindow.show();
      }, 3000);
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(store)));

  showWindow();
};

app.on("ready", createWindow);

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

app.whenReady().then(() => {
  protocol.handle("app", (req) => {
    const { pathname } = new URL(req.url);
    return net.fetch(pathToFileURL(pathname).toString());
  });
});

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

async function clipboardCopy(_event, content) {
  clipboard.writeText(content, "clipboard");
}

async function openExternalLink(_event, href) {
  shell.openExternal(href);
}

async function loadModel(_event, modelPath) {
  const selectedModelPath = modelPath ?? store.get(seletedModelName);

  if (!selectedModelPath || !fs.existsSync(selectedModelPath)) {
    return "";
  }

  if (!llamaNodeCPP.isReady()) {
    await llamaNodeCPP.loadModule();
    await llamaNodeCPP.loadLlama(store.get(gpuName) === "false" ? false : store.get(gpuName));
  }

  if (
    llamaNodeCPP.isReady() &&
    (await llamaNodeCPP.getInfos()).model !== undefined &&
    selectedModelPath.includes((await llamaNodeCPP.getInfos()).model?.filename) &&
    store.get(gpuName) === (await llamaNodeCPP.getInfos()).model?.gpu
  ) {
    return selectedModelPath;
  }

  if (llamaNodeCPP.isReady() && (await llamaNodeCPP.getInfos()).context !== undefined) {
    llamaNodeCPP.clearHistory();
    await llamaNodeCPP.disposeModel();
    await llamaNodeCPP.disposeSession();
    await llamaNodeCPP.disposeLlama();
    await llamaNodeCPP.loadLlama(store.get(gpuName) === "false" ? false : store.get(gpuName));
  }
  await llamaNodeCPP.loadModel(selectedModelPath);
  await llamaNodeCPP.initSession(store.get(systemPromptName) ?? promptSystem);

  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send("model-changed", selectedModelPath);
  }

  store.set(seletedModelName, selectedModelPath ?? "");

  if (llamaNodeCPP.isReady()) {
    return selectedModelPath;
  } else {
    store.set(gpuName, defaultGPU);
    return "";
  }
}

async function saveHistory(_event) {
  const date = new Date();
  const defaultFileName = `${date.toISOString().replaceAll(":", "-")}.${historyFileExtension}`;
  const result = await dialog.showSaveDialog({
    title: "Save file as",
    defaultPath: path.join(store.get(historyFolderName), defaultFileName),
    filters: [
      {
        name: "Conversation history",
        extensions: [historyFileExtension],
      },
    ],
  });

  if (!result || result.canceled) return "";

  try {
    const history = await llamaNodeCPP.getHistory();
    const conversation = {
      history: history,
      model_path: store.get(seletedModelName),
      prompt_system: store.get(systemPromptName),
      gpu: store.get(gpuName),
      temperature: store.get(temperatureName),
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
        extensions: [historyFileExtension],
      },
    ],
    title: "Load history from...",
    defaultPath: store.get(historyFolderName),
    properties: ["openFile"],
  });
  if (!result || result.canceled) return;
  try {
    historyParm = JSON.parse(fs.readFileSync(result.filePaths[0], "utf-8"));
    store.set(seletedModelName, historyParm.model_path ?? "");
    store.set(systemPromptName, historyParm.prompt_system ?? "");
    store.set(gpuName, historyParm.gpu ?? defaultGPU);
    store.set(temperatureName, historyParm.temperature ?? defaultGPU);

    llamaNodeCPP.clearHistory();
    await llamaNodeCPP.disposeSession();
    await llamaNodeCPP.disposeModel();
    await llamaNodeCPP.disposeLlama();

    await loadModel();
    await llamaNodeCPP.setHistory(historyParm.history);
    llamaNodeCPP.temperature = store.get(temperatureName);
    return historyParm.history;
  } catch (e) {
    console.error(e, result);
    return;
  }
}

async function changeModelGpuUse(_event, gpuUse) {
  store.set(gpuName, gpuUse);
  llamaNodeCPP.clearHistory();
  await llamaNodeCPP.disposeSession();
  await llamaNodeCPP.disposeModel();
  await llamaNodeCPP.disposeLlama();
  await loadModel();
}

async function changeModelSystemPrompt(_event, promptSystem) {
  store.set(systemPromptName, promptSystem);
  llamaNodeCPP.clearHistory();
  await llamaNodeCPP.disposeSession();
  await llamaNodeCPP.disposeModel();
  await llamaNodeCPP.disposeLlama();
  await loadModel();
}

async function changeTemperature(_event, temperature) {
  store.set(temperatureName, temperature);
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
    return "Something went wrong. Try to choose another model or restart the application ";
  }
  const temp = store.get(temperatureName);
  const c = await llamaNodeCPP.prompt(userMessage, undefined, {
    temperature: temp,
  });
  return c ?? "Something went wrong. Try to choose another model or restart the application ";
}

async function changeModel() {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Models", extensions: [modelFileExtension] }],
    defaultPath: store.get(modelsFolderName),
    properties: ["openFile"],
  });
  if (filePaths === undefined || filePaths?.length < 1 || !fs.existsSync(filePaths[0])) {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("model-changed", store.get(seletedModelName) ?? "");
    }
    return;
  }
  await loadModel(undefined, filePaths[0]);
}
