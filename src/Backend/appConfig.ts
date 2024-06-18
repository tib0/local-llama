import { shell } from "electron";

export function appMenu(store) {
  const isMacOS = process.platform === "darwin";
  return [
    ...(isMacOS ? [{ role: "appMenu" }] : []),
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
          label: "Author",
          click: async () => {
            await shell.openExternal("https://folio.tib0.com");
          },
        },
      ],
    },
  ];
}

export function winBounds(store) {
  const winBounds = {
    width: 1280,
    height: 680,
  };

  Object.assign(winBounds, store.get("winBounds"));

  return winBounds;
}
