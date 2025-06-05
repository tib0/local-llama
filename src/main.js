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
  session,
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
import { parseOfficeAsync } from "officeparser";

const store = new Store();
const llamaNodeCPP = new LlamaWrapper();

protocol.registerSchemesAsPrivileged([{ scheme: "app" }]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cacheFolderPath = path.join(os.homedir(), ".cache/local-llama");

const modelsFolderName = "models";
const historyFolderName = "history";
const logsFolderName = "logs";
const seletedModelName = "selected_model";
const gpuName = "gpu";
const temperatureName = "temperature";
const systemPromptName = "prompt_system";
const lastModelFilePathName = "last_model_file_path";
const lastDocumentFilePathName = "last_document_file_path";

const defaultGPU = "auto";
const defaultTemperature = 0;

const historyFileExtension = "lllh";
const modelFileExtension = "gguf";
const documentFileExtension = ["docx", "pptx", "xlsx", "odt", "odp", "ods", "pdf", "txt"];

const logsFileName = "Local-Llama.log";

const modelsFolderPath = path.join(cacheFolderPath, modelsFolderName);
const historyFolderPath = path.join(cacheFolderPath, historyFolderName);
const logsFolderPath = path.join(cacheFolderPath, logsFolderName);

initFolder(store, modelsFolderPath, modelsFolderName);
initFolder(store, historyFolderPath, historyFolderName);
initFolder(store, logsFolderPath, logsFolderName);

initSelectedModel(store, modelsFolderPath, seletedModelName, modelFileExtension);
initStoreValue(store, gpuName, defaultGPU);
initStoreValue(store, temperatureName, defaultTemperature);

log.transports.file.resolvePathFn = () => {
  return path.join(logsFolderPath, logsFileName);
};

if (app.isPackaged) {
  log.transports.file.level = "warn";
  log.transports.console.level = false;
} else {
  log.transports.file.level = "info";
  log.transports.console.level = "debug";
}

log.eventLogger.startLogging();

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

  async function clearLocalData() {
    log.info("Clear data");
    await session.defaultSession.clearData();
    log.info("Clear storage data");
    await session.defaultSession.clearStorageData();
    log.info("Clear cache");
    await session.defaultSession.clearCache();
    log.info("Clear store data");
    store.clear();
    log.info("About to quit the app");
    app.quit();
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(store, clearLocalData)));

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

ipcMain.on("document-change", selectDocumentToParse);

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
    log.info(
      "No model path found or file not found. Aborting model load. Model path:",
      selectedModelPath,
    );
    return "";
  }

  if (!llamaNodeCPP.isReady()) {
    log.info("LlamaNodeCPP not ready, about to load a new instance");
    await llamaNodeCPP.loadModule();
    await llamaNodeCPP.loadLlama(store.get(gpuName) === "false" ? false : store.get(gpuName));
  }

  try {
    const infos = await llamaNodeCPP.getInfos();
    if (
      llamaNodeCPP.isReady() &&
      infos.model !== undefined &&
      selectedModelPath.includes(infos.model?.filename) &&
      (store.get(gpuName) === infos.llama?.gpu || store.get(gpuName) === "auto")
    ) {
      log.info(
        "Selected model is allready running with same parameters, broadcast the information to each window",
      );
      for (const window of BrowserWindow.getAllWindows()) {
        window.webContents.send("model-changed", "");
      }
      return selectedModelPath;
    }

    if (llamaNodeCPP.isReady() && infos.context !== undefined) {
      log.info(
        "Llama node cpp allready running, about to dispose model and session before reloading",
      );
      llamaNodeCPP.clearHistory();
      await llamaNodeCPP.disposeModel();
      await llamaNodeCPP.disposeSession();
      await llamaNodeCPP.disposeLlama();
      await llamaNodeCPP.loadLlama(
        store.get(gpuName) === "false" ? false : store.get(gpuName),
      );
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
  } catch (error) {
    log.error(error);
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

async function loadHistory(event) {
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
    log.info("Selected file not found or operation canceled");
    return;
  }
  try {
    log.info("Parsing history file");
    historyParm = JSON.parse(fs.readFileSync(result.filePaths[0], "utf-8"));
    store.set(systemPromptName, historyParm.prompt_system ?? "");
    store.set(gpuName, historyParm.gpu ?? defaultGPU);
    store.set(temperatureName, historyParm.temperature ?? defaultGPU);
    log.info("Clearing node llama cpp previous history");
    llamaNodeCPP.clearHistory();
    if (!historyParm.model_path || !fs.existsSync(historyParm.model_path)) {
      log.warn("Model path not found in:", historyParm.model_path, "from", historyParm);
      log.info("Sticking to current model");
    } else {
      store.set(seletedModelName, historyParm.model_path ?? "");
      log.info("Disposing model and session");
      await llamaNodeCPP.disposeSession();
      await llamaNodeCPP.disposeModel();
      await llamaNodeCPP.disposeLlama();
      await loadModel(event, historyParm.model_path);
    }
    await llamaNodeCPP.setHistory(historyParm.history);
    log.info("History updated");
    llamaNodeCPP.temperature = store.get(temperatureName);
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

  const streamCallback = (c) => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("chunk-received", c);
    }
  };

  let c = "";
  try {
    c = await llamaNodeCPP.prompt(userMessage, streamCallback, {
      temperature: temp,
    });
  } catch (error) {
    log.error(error);
  }
  return c ?? "Something went wrong. Try to choose another model or restart the application ";
}

async function changeModel(event) {
  log.info("Updating the model");
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Models", extensions: [modelFileExtension] }],
    defaultPath:
      store.get(lastModelFilePathName) && store.get(lastModelFilePathName) !== ""
        ? store.get(lastModelFilePathName)
        : store.get(modelsFolderName),
    properties: ["openFile"],
  });
  if (filePaths === undefined || filePaths?.length < 1 || !fs.existsSync(filePaths[0])) {
    log.info("Selected model not found or operation canceled");
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("model-changed", "");
    }
  } else {
    try {
      await loadModel(event, filePaths[0]);
      store.set(lastModelFilePathName, filePaths[0]);
    } catch (error) {
      log.error(error);
    }
  }
}

const prefixDocument =
  'Your duty is to answer question about the following document content: "';

const suffixDocument =
  '". You answer in the same language as the user asking you question is speaking.';

function getCleanedPrompt(data) {
  return data
    .toString()
    .replace(/\s\s+/g, " ")
    .replace(/\-\<\{NewLine\}\>+/g, "")
    .replace(/\<\{NewLine\}\>+/g, " ")
    .replace(/\.\.+/g, ".")
    .slice(0, 16000);
}

async function parseOfficeDocument(event, filePath) {
  log.info("About to parse office document:", filePath);
  const config = {
    newlineDelimiter: "<{NewLine}>",
    ignoreNotes: true,
    outputErrorToConsole: true,
    tempFilesLocation: cacheFolderPath,
  };
  try {
    await parseOfficeAsync(filePath, config)
      .then(async (data) => {
        log.info("Document parsed successfully");
        await changeModelSystemPrompt(
          event,
          prefixDocument + getCleanedPrompt(data) + suffixDocument,
        );
      })
      .catch((error) => log.error(error));
    store.set(lastDocumentFilePathName, filePath);
  } catch (error) {
    log.error(error);
  }
}

async function parseTextDocument(event, filePath) {
  log.info("About to parse text document:", filePath);
  try {
    fs.readFile(filePath, async (error, data) => {
      if (error) {
        log.error(error);
      } else {
        log.info("Document parsed successfully");
        await changeModelSystemPrompt(
          event,
          prefixDocument + getCleanedPrompt(data) + suffixDocument,
        );
      }
    });
    store.set(lastDocumentFilePathName, filePath);
  } catch (error) {
    log.error(error);
  }
}

async function selectDocumentToParse(event) {
  log.info("Select a document to parse");
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Models", extensions: documentFileExtension }],
    defaultPath:
      store.get(lastDocumentFilePathName) && store.get(lastDocumentFilePathName) !== ""
        ? store.get(lastDocumentFilePathName)
        : os.homedir(),
    properties: ["openFile"],
  });
  if (filePaths === undefined || filePaths?.length < 1 || !fs.existsSync(filePaths[0])) {
    log.info("Selected document not found or operation canceled");
  } else {
    switch (path.extname(filePaths[0])) {
      case ".txt":
        await parseTextDocument(event, filePaths[0]);
        break;
      default:
        await parseOfficeDocument(event, filePaths[0]);
        break;
    }
  }
}
