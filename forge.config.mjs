export default {
  buildIdentifier: "esm",
  defaultResolved: true,
  packagerConfig: {
    appCategoryType: "public.app-category.utilities",
    icon: "./static/icon",
    darwinDarkModeSupport: "true",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        iconUrl: "./static/icon.png",
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
