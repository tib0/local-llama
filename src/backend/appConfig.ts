import { app, Menu, MenuItem, shell } from "electron";
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
    height: 418,
    minHeight: 418,
    maximizable: true,
    minimizable: true,
    movable: true,
    resizable: true,
    show: false,
    width: 334,
    minWidth: 334,
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

  if (!app.isPackaged) {
    menu.append(new MenuItem({ role: "toggleDevTools" }));
    if (params.dictionarySuggestions.length > 0 || params.misspelledWord)
      menu.append(new MenuItem({ type: "separator" }));
  }

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

  menu.append(new MenuItem({ type: "separator", visible: (canUndo || canRedo) && editable }));
  menu.append(new MenuItem({ role: "undo", visible: canUndo && editable }));
  menu.append(new MenuItem({ role: "redo", visible: canRedo && editable }));
  menu.append(
    new MenuItem({
      type: "separator",
      visible: ((canCut || canPaste || canDelete) && editable) || canCopy,
    }),
  );
  menu.append(new MenuItem({ role: "cut", visible: canCut && editable }));
  menu.append(new MenuItem({ role: "copy", visible: canCopy }));
  menu.append(new MenuItem({ role: "paste", visible: canPaste && editable }));
  menu.append(new MenuItem({ role: "delete", visible: canDelete && editable }));
  menu.append(new MenuItem({ type: "separator", visible: canSelectAll }));
  menu.append(
    new MenuItem({ role: "selectAll", enabled: canSelectAll, visible: canSelectAll }),
  );

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
