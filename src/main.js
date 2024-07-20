import {
  app,
  BrowserWindow,
  Menu,
  clipboard,
  dialog,
  ipcMain,
  net,
  protocol,
  shell,
} from "electron";
import { handleSquirrelEvent } from "./backend/windowsSquirelInstallEvent";

if (handleSquirrelEvent() || !app.requestSingleInstanceLock()) {
  app.quit();
}

import fs from "fs";
import os from "os";
import path from "path";
import Store from "electron-store";
import { fileURLToPath, pathToFileURL } from "url";
import { LlamaWrapper } from "./frontend/lib/llamaNodeCppWrapper";
import {
  appContextMenu,
  appMenu,
  promptSystem,
  winBounds,
  mainWindowOptions,
  splashWindowOptions,
} from "./backend/appConfig";
import { initFolder, initSelectedModel, initStoreValue } from "./backend/appHelpers";
import log from "electron-log/main";

const store = new Store();

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

const logsFileName = "Local-Llama.log";

const modelsFolderPath = path.join(cache, modelsFolderName);
const historyFolderPath = path.join(cache, historyFolderName);
const logsFolderPath = path.join(cache, logsFolderName);

initFolder(store, modelsFolderPath, modelsFolderName);
initFolder(store, historyFolderPath, historyFolderName);
initFolder(store, logsFolderPath, logsFolderName);

initSelectedModel(store, modelsFolderPath, seletedModelName, modelFileExtension);
initStoreValue(store, gpuName, defaultGPU);
initStoreValue(store, temperatureName, defaultTemperature);

log.transports.file.resolvePathFn = () => {
  return path.join(logsFolderPath, logsFileName);
};

let llamaNodeCPP = new LlamaWrapper();
llamaNodeCPP.logger = log;

const createWindow = () => {
  log.info("Creating window");
  const mainWindow = new BrowserWindow(mainWindowOptions(__dirname));
  const splash = new BrowserWindow(splashWindowOptions);

  log.info("Applying preload error handler");
  mainWindow.webContents.on("preload-error", (_event, preloadPath, error) => {
    log.error("Preload error");
    log.error(preloadPath);
    log.error(error.name + " - " + error.message);
  });

  log.info("Applying bounds");
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

  log.info("Applying load error handler");
  mainWindow.webContents.on(
    "did-fail-load",
    (_event, _errorCode, errorDescription, validatedURL) => {
      log.error("Failed load error");
      log.error(errorDescription + " - " + validatedURL);
    },
  );

  log.info("Loading splash screen");
  splash.loadFile(`splash.html`);

  mainWindow.on("close", () => {
    log.info("About to close window, saving bounds");
    store.set("winBounds", {
      isMaximized: mainWindow.isMaximized(),
      ...mainWindow.getNormalBounds(),
    });
  });

  app.on("second-instance", (_event, _argv, _cwd) => {
    log.info("Trying to start second instance");
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  log.info("Applying context menu");
  mainWindow.webContents.on("context-menu", (_event, params) => {
    appContextMenu(params, mainWindow);
  });

  function showWindow() {
    mainWindow.once("ready-to-show", () => {
      setTimeout(async function () {
        log.info("Loading model");
        await loadModel();
        log.info("Applying stored temperature");
        llamaNodeCPP.temperature = store.get(temperatureName);
        log.info("Remove splash screen");
        splash.destroy();
        log.info("Window ready to be shown");
        mainWindow.show();
      }, 3000);
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(store)));

  showWindow();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  log.info("Window closed");
  log.info("Disposing model and session");
  llamaNodeCPP.disposeModel();
  llamaNodeCPP.disposeSession();
  llamaNodeCPP = undefined;
  log.info("Quit");
  app.quit();
});

app.on("activate", () => {
  log.info("Activation of window");
  if (BrowserWindow.getAllWindows().length === 0) {
    log.info("No window found, about to create a new one");
    createWindow();
  }
});

process.on("unhandledRejection", function (e) {
  log.error(`unhandledRejection`);
  log.error(`${e.name} - ${e.message}`);
  log.error(`${e.stack}`);
});

process.on("uncaughtException", function (e) {
  log.error(`uncaughtException`);
  log.error(`${e.name} - ${e.message}`);
  log.error(`${e.stack}`);
});

app.on("unhandledRejection", function (e) {
  log.error(`app unhandledRejection`);
  log.error(`${e.name} - ${e.message}`);
  log.error(`${e.stack}`);
});

app.on("uncaughtException", function (e) {
  log.error(`app uncaughtException`);
  log.error(`${e.name} - ${e.message}`);
  log.error(`${e.stack}`);
});

ipcMain.removeAllListeners("ELECTRON_BROWSER_WINDOW_ALERT");
ipcMain.on("ELECTRON_BROWSER_WINDOW_ALERT", (event, message, title) => {
  log.error(`ELECTRON_BROWSER_WINDOW_ALERT`);
  log.error(`${title} - ${message}`);
  event.returnValue = 0;
});

app.whenReady().then(() => {
  log.info("App is ready");
  log.info("Attach app:// protocol");
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

ipcMain.on("abort-prompt", abortPrompt);

ipcMain.on("model-change", changeModel);

ipcMain.on("model-change-gpu-use", changeModelGpuUse);

ipcMain.on("model-change-system-prompt", changeModelSystemPrompt);

ipcMain.on("model-change-temperature", changeTemperature);

ipcMain.on("model-clear-history", clearHistory);

ipcMain.on("open-external-link", openExternalLink);

ipcMain.on("clipboard-copy", clipboardCopy);

async function clipboardCopy(_event, content) {
  log.info("Copy to clipboard triggered");
  clipboard.writeText(content, "clipboard");
}

async function openExternalLink(_event, href) {
  log.info("External link opened");
  shell.openExternal(href);
}

async function loadModel(_event, modelPath) {
  log.info("Loading a model");
  const selectedModelPath = modelPath ?? store.get(seletedModelName);

  if (!selectedModelPath || !fs.existsSync(selectedModelPath)) {
    log.info("No model path found. Aborting model load");
    return "";
  }

  if (!llamaNodeCPP.isReady()) {
    log.info("LlamaNodeCPP not ready, about to load a new instance");
    await llamaNodeCPP.loadModule();
    await llamaNodeCPP.loadLlama(store.get(gpuName) === "false" ? false : store.get(gpuName));
  }

  if (
    llamaNodeCPP.isReady() &&
    (await llamaNodeCPP.getInfos()).model !== undefined &&
    selectedModelPath.includes((await llamaNodeCPP.getInfos()).model?.filename) &&
    store.get(gpuName) === (await llamaNodeCPP.getInfos()).model?.gpu
  ) {
    log.info("Selected model is allready running with same parameters");
    return selectedModelPath;
  }

  if (llamaNodeCPP.isReady() && (await llamaNodeCPP.getInfos()).context !== undefined) {
    log.info(
      "Llama node cpp allready running, about to dispose model and session before reloading.",
    );
    llamaNodeCPP.clearHistory();
    await llamaNodeCPP.disposeModel();
    await llamaNodeCPP.disposeSession();
    await llamaNodeCPP.disposeLlama();
    await llamaNodeCPP.loadLlama(store.get(gpuName) === "false" ? false : store.get(gpuName));
  }
  await llamaNodeCPP.loadModel(selectedModelPath);
  log.info("New model loaded");
  await llamaNodeCPP.initSession(store.get(systemPromptName) ?? promptSystem);
  log.info("New session initialized");

  log.info("Broadcast model changed event to each window");
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send("model-changed", selectedModelPath);
  }

  store.set(seletedModelName, selectedModelPath ?? "");

  if (llamaNodeCPP.isReady()) {
    log.info("Llama node cpp is ready after loading the model");
    return selectedModelPath;
  } else {
    log.warn(
      "Llama node cpp was not initialized correctly, about to reset default GPU usage.",
    );
    store.set(gpuName, defaultGPU);
    return "";
  }
}

async function saveHistory(_event) {
  log.info("Saving history");
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

  if (!result || result.canceled) {
    log.warn("Aborted or unknown file while dialog was shown");
    return "";
  }

  try {
    log.info("Retrieving history");
    const history = await llamaNodeCPP.getHistory();
    const conversation = {
      history: history,
      model_path: store.get(seletedModelName),
      prompt_system: store.get(systemPromptName),
      gpu: store.get(gpuName),
      temperature: store.get(temperatureName),
    };
    fs.writeFileSync(result.filePath, JSON.stringify(conversation), "utf-8");
    log.info("History saved");
  } catch (e) {
    log.error(e, result);
    return "";
  }

  return result.filePath;
}

async function loadHistory(_event) {
  log.info("Loading history");
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
  if (!result || result.canceled) {
    log.warn("Aborted or unknown file while dialog was shown");
    return;
  }
  try {
    log.info("Parsing history file");
    historyParm = JSON.parse(fs.readFileSync(result.filePaths[0], "utf-8"));
    store.set(seletedModelName, historyParm.model_path ?? "");
    store.set(systemPromptName, historyParm.prompt_system ?? "");
    store.set(gpuName, historyParm.gpu ?? defaultGPU);
    store.set(temperatureName, historyParm.temperature ?? defaultGPU);

    log.info("Clearing node llama cpp history");
    llamaNodeCPP.clearHistory();
    log.info("Disposing model and session");
    await llamaNodeCPP.disposeSession();
    await llamaNodeCPP.disposeModel();
    await llamaNodeCPP.disposeLlama();

    await loadModel();
    await llamaNodeCPP.setHistory(historyParm.history);
    llamaNodeCPP.temperature = store.get(temperatureName);
    log.info("History updated");
    return historyParm.history;
  } catch (e) {
    log.error(e, result);
    return;
  }
}

async function changeModelGpuUse(_event, gpuUse) {
  log.info("Update GPU use");
  store.set(gpuName, gpuUse);
  llamaNodeCPP.clearHistory();
  log.info("Reload model and session");
  await llamaNodeCPP.disposeSession();
  await llamaNodeCPP.disposeModel();
  await llamaNodeCPP.disposeLlama();
  await loadModel();
}

async function changeModelSystemPrompt(_event, promptSystem) {
  log.info("Updating system prompt");
  store.set(systemPromptName, promptSystem);
  llamaNodeCPP.clearHistory();
  log.info("Reload model and session");
  await llamaNodeCPP.disposeSession();
  await llamaNodeCPP.disposeModel();
  await llamaNodeCPP.disposeLlama();
  await loadModel();
}

async function changeTemperature(_event, temperature) {
  log.info("Updating temperature");
  store.set(temperatureName, temperature);
}

async function quitApp(_event) {
  log.info("Quit app");
  app.quit();
}

async function clearHistory() {
  log.info("Clearing history");
  if (llamaNodeCPP.isReady() && (await llamaNodeCPP.getInfos()).context !== undefined) {
    llamaNodeCPP.clearHistory();
  }
}

async function abortPrompt() {
  log.info("Aborting prompt");
  llamaNodeCPP.errorCallback();
}

async function getModelInfo() {
  const i = await llamaNodeCPP.getInfos();
  return JSON.stringify(i);
}

async function chat(_event, userMessage) {
  log.info("Prompting to chat");
  if (!llamaNodeCPP.isReady()) {
    log.warn("Llama node cpp is not ready, abort");
    return "Something went wrong. Try to choose another model or restart the application ";
  }
  const temp = store.get(temperatureName);
  let c = "";
  try {
    c = await llamaNodeCPP.prompt(userMessage, undefined, {
      temperature: temp,
    });
  } catch (error) {
    log.error(error);
  }
  return c ?? "Something went wrong. Try to choose another model or restart the application ";
}

async function changeModel() {
  log.info("Updating the model");
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Models", extensions: [modelFileExtension] }],
    defaultPath: store.get(modelsFolderName),
    properties: ["openFile"],
  });
  if (filePaths === undefined || filePaths?.length < 1 || !fs.existsSync(filePaths[0])) {
    log.info("Selected model not found or unknown");
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("model-changed", store.get(seletedModelName) ?? "");
    }
    return;
  }
  await loadModel(undefined, filePaths[0]);
}
