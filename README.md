# local-llama

![Logo](./src/assets/logo.webp)

L³ or Local Llama is an electron app that runs Llama 3 models locally.

## Feature

 - ✅ Locally run llama models
 - ✅ Use GPU or CPU
 - ✅ Set temperature
 - ✅ Customize system prompt
 - ✅ Save conversation history

## Installation

Download the latest release from [here](https://github.com/tib0/local-llama/releases).

## Screens

### Dark theme
![Dark chat h](./static/d-h-chat.webp) 

![Dark chat v](./static/d-v-chat.webp) 

### Light theme
![Light chat h](./static/l-h-chat.webp)

![Light chat v](./static/l-v-chat.webp)

## App settings

![Zoom on button](./static/zoom-button.webp) 

![Zoom on system prompt](./static/zoom-sprompt.webp) 

## Project Setup

### Install

```bash
$ npm i
```

### Development

```bash
$ npm run dev
```

### Build

```bash
$ npm run build
```

### Package

```bash
$ npm run package
```

### Make

```bash
$ npm run make
```

## Made with

 
 **React**
 
 **Electron**
 
 **Forge**
 
 **Tailwind CSS**
 
 **DaisyUI**
 
 **electron-forge-plugin-vite-esm**: Fix the issue with esm interop embeded in electron app [here](https://github.com/fozziethebeat/electron-forge-plugin-vite-esm).
 
 **node-llama-cpp**: Awsome node wrapper for llama [here](https://github.com/withcatai/node-llama-cpp).

<style type="text/css">
  ul {
    list-style-type: none;  
  }
  img {
    max-width: 550px;
    max-height: 350px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: auto;
    height: auto;
  }
</style>