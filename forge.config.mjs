export default {
  buildIdentifier: "esm",
  defaultResolved: true,
  packagerConfig: {
    compression: "store",
    appCategoryType: "public.app-category.utilities",
    icon: "./static/icon",
    darwinDarkModeSupport: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        authors: "Tib0",
        description: "L³ or Local Llama is an electron app that runs Llama 3 models locally",
        iconUrl: "app://./static/icon.png",
        loadingGif: "static/waitin-lama.gif",
        setupIcon: "static/icon.ico",
        name: "LocalLlamaChatApp",
      },
    },
    {
      name: "@electron-forge/maker-wix",
      config: {
        language: 1033,
        manufacturer: "Tib0",
        description: "Local Llama is an electron app that runs Llama 3 models locally",
        icon: "./static/icon.ico",
        name: "Local Llama",
        shortcutFolderName: "Local-Llama",
        ui: {
          chooseDirectory: true,
        },
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
      config: {
        icon: "./static/icon.icns",
      },
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: "./static/icon.png",
        },
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {
        icon: "./static/icon.png",
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-vite",
      config: {
        build: [
          {
            entry: "src/main.js",
            config: "vite.main.config.ts",
          },
          {
            entry: "src/preload.js",
            config: "vite.preload.config.ts",
          },
        ],
        renderer: [
          {
            name: "main_window",
            config: "vite.renderer.config.ts",
          },
        ],
      },
    },
  ],
};
