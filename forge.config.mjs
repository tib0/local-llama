export default {
  buildIdentifier: "esm",
  defaultResolved: true,
  packagerConfig: {
    executableName: "local-llama",
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
        name: "local-llama",
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
        shortcutFolderName: "local-llama",
        ui: {
          chooseDirectory: true,
        },
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "linux"],
      config: {
        icon: "./static/icon.icns",
      },
    },
    /* DMG: Uncomment to target dmg, need appdmg dep installed
    {
      name: "@electron-forge/maker-dmg",
      config: {
        background: "./static/icon.png",
        format: "ULFO",
        icon: "./static/icon.icns",
        name: "Local Llama",
        overwrite: true,
      },
    }, */
    {
      name: "@electron-forge/maker-deb",
      executableName: "local-llama",
      config: {
        options: {
          icon: "./static/icon.png",
          name: "Local Llama",
          productName: "Local Llama",
          description: "Local Llama is an electron app that runs Llama 3 models locally",
          productDescription:
            "This recreational project aim to help you run LLM models locally 🚀. With local llama, you can safely use Llama 3 models without needing to register to any exernal services. You will be able to run gguf models.",
          maintainer: "Tib0",
          categories: ["Utility"],
          genericName: "Local Llama AI Chat",
          mimeType: ["lllh", "gguf"],
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
