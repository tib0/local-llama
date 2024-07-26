import { Menu, MenuItem, shell } from "electron";
import path from "path";
import type Store from "electron-store";

export const promptSystem = `You are an assistant to a human being.`;

export const mainWindowOptions = (dirname: string) =>
  ({
    webPreferences: {
      preload: path.join(dirname, "preload.js"),
    },
    center: true,
    frame: false,
    hasShadow: true,
    height: 682,
    maximizable: true,
    minimizable: true,
    movable: true,
    resizable: true,
    show: false,
    width: 450,
  }) as Electron.BrowserWindowConstructorOptions;

export const splashWindowOptions: Electron.BrowserWindowConstructorOptions = {
  backgroundColor: "#00000000",
  backgroundMaterial: "acrylic",
  center: true,
  frame: false,
  hasShadow: true,
  height: 340,
  maximizable: false,
  minimizable: false,
  movable: true,
  resizable: false,
  vibrancy: "popover",
  visualEffectState: "followWindow",
  width: 225,
};

export function appMenu(store: Store<Record<string, string>>, clearLocalData: () => void) {
  const isMacOS = process.platform === "darwin";
  return [
    ...(isMacOS ? [{ role: "appMenu" }] : []),
    { role: "viewMenu" },
    { role: "editMenu" },
    {
      role: "help",
      submenu: [
        {
          label: "Github Project",
          click: async () => {
            await shell.openExternal("https://github.com/tib0/local-llama");
          },
        },
        {
          label: "Open history folder",
          click: async () => {
            await shell.openPath(store.get("history_dir"));
          },
        },
        {
          label: "Open logs folder",
          click: async () => {
            await shell.openPath(store.get("log_dir"));
          },
        },
        {
          label: "Open model folder",
          click: async () => {
            await shell.openPath(store.get("model_dir"));
          },
        },
        {
          label: "Clear local data",
          click: async () => {
            if (clearLocalData) await clearLocalData();
          },
        },
        {
          label: "Author",
          click: async () => {
            await shell.openExternal("https://folio.tib0.com");
          },
        },
      ],
    },
  ];
}

export function appContextMenu(
  params: Electron.ContextMenuParams,
  mainWindow: Electron.BrowserWindow,
) {
  const menu = new Menu();

  for (const suggestion of params.dictionarySuggestions) {
    menu.append(
      new MenuItem({
        label: suggestion,
        click: () => mainWindow?.webContents.replaceMisspelling(suggestion),
      }),
    );
  }

  if (params.misspelledWord) {
    menu.append(
      new MenuItem({
        label: "Add to dictionary",
        click: () =>
          mainWindow?.webContents.session.addWordToSpellCheckerDictionary(
            params.misspelledWord,
          ),
      }),
    );
  }

  const { canUndo, canRedo, canCut, canCopy, canPaste, canDelete, canSelectAll } =
    params.editFlags;

  const editable = params.isEditable;

  menu.append(new MenuItem({ type: "separator" }));
  menu.append(new MenuItem({ role: "undo", enabled: canUndo && editable }));
  menu.append(new MenuItem({ role: "redo", enabled: canRedo && editable }));
  menu.append(new MenuItem({ type: "separator" }));
  menu.append(new MenuItem({ role: "cut", enabled: canCut && editable }));
  menu.append(new MenuItem({ role: "copy", enabled: canCopy }));
  menu.append(new MenuItem({ role: "paste", enabled: canPaste && editable }));
  menu.append(new MenuItem({ role: "delete", enabled: canDelete && editable }));
  menu.append(new MenuItem({ type: "separator" }));
  menu.append(new MenuItem({ role: "selectAll", enabled: canSelectAll }));

  menu.popup();
}

export function winBounds(
  store: Store<
    Record<
      string,
      {
        width: number;
        height: number;
      }
    >
  >,
) {
  const winBounds = {
    width: 1280,
    height: 680,
  };

  Object.assign(winBounds, store.get("winBounds"));

  return winBounds;
}
