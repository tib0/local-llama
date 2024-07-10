# L³ - Local Llama

<p align="center">
  <img src="./.github/logo_25.webp" />
</p>
<p align="center" style="font-size:18px; font-weight:600; margin-bottom: 10px;">
  Local Llama also known as L³ is designed to be easy to use, with a user-friendly interface and advanced settings.
</p>

<p align="center" style="margin: 5px;">
  L³ allows you to select different gguf models and run them locally without relying on external servers or APIs.
</p>
<p align="center" style="margin: 5px;">
  You are able to save their conversation history and load it later.
</p>

<p align="center" style="margin: 5px;">
  With L³ you have full control over the models used and how it is setup, making it an ideal solution for anyone who wan't to chat with LLM models while offline.
</p>

### Features

<ul style="font-weight: 600;">
  <li>🔧 Customizable model settings</li>
  <li>🖥️ Windows & Mac supported</li>
  <li>📞 Save conversation history</li>
  <li>✈️ Offline</li>
  <li>💸 Free</li>
</ul>

## Summary

- [💻 Installation](#installation)
- [📸 Screenshots](#screenshots)
- [🔧 Settings](#settings)
- [❔️ How it Works](#how-it-works)
- [⬇️ Use from source](#use-from-source)
- [👨‍💼 Dependencies](#dependencies)
- [📜 License](#license)

## Installation

### Find a gguf model

You can download a model from [Hugginface](https://huggingface.co/models?search=gguf). Any gguf
model should work with Local Llama.

### Mac OS

<details>
  <summary>
    M1, M2, M3 processors..
  </summary>

1. Download the latest release from
   [Local.Llama-darwin-arm64-0.0.1.zip](https://github.com/tib0/local-llama/releases#:~:text=Local.Llama%2Ddarwin%2Darm64%2D0.0.1.zip).
2. Uncompress the zip
3. Run the file `Local Llama.app`.
</details>

</br>
<details>
  <summary>
    Intel processors... 
  </summary>

1. Download the latest release from
   [Local.Llama-darwin-x64-0.0.1.zip](https://github.com/tib0/local-llama/releases/download/0.0.1/Local.Llama-darwin-x64-0.0.1.zip).
2. Uncompress the zip
3. Run the file `Local Llama.app`.
</details>

### Windows

<details>
  <summary>
    All 
  </summary>

1. Download the latest release from
   [Local.Llama-0.0.1.Setup.exe](https://github.com/tib0/local-llama/releases/download/0.0.1/Local.Llama-0.0.1.Setup.exe).
2. Run the file `Local Llama.exe`. It will start an installer wich copy mandatory files to the
   right place.
3. Launch the app `Local Llama`.
</details>

### Linux

<details>
  <summary>
    All
  </summary>

1.  Build and make the app from sources by looking at "Use from source" section. Use the
    package or make command.
2.  Go to folder out > make to find the generated file.
</details>

## Screenshots

### Light and dark theme

<p align="center">
  <img width="455px" style="padding:10px;" src="./.github/l-h-chat_55.webp" />
  <img width="455px" style="padding:10px;" src="./.github/d-h-chat_55.webp" />
</p>

### Settings panel

<p align="center">
  <img width="455px" style="padding:10px;" src="./.github/l-h-settings_55.webp" />
</p>

### Responsive window

<p align="center">
  <img height="285px" style="padding:10px;" src="./.github/d-h-chat_55.webp" />
  <img height="285px" style="padding:10px;" src="./.github/d-v-chat_55.webp" />
</p>

## Settings

### Details

<p align="center">
  <img height="200px" style="padding:10px;" src="./.github/zoom-button_55.webp" />
</p>

- **Model...**: This button is used to load a new model into the application. It open up a
  browse window. The model can be any `.gguf` llama model. If you want you can find models at
  [Hugginface](https://huggingface.co/models?search=gguf).
  > ##
  >
  > ### GGUF
  >
  > The GGUF (Generative GPT Unified Format) is a file format used to store the outputs of
  > LLMs. It's a compressed binary format that allows for efficient storage and loading of
  > generated text.
  >
  > #
- **Auto**: This dropdown is used to select where computations are performed. On Macos, in
  newer M type processor you can only select `auto` or `metal` option. On Windows, you can
  choose `auto`, `none` or `vulkan` option.
- **History...**: This button open up a browse window where you can select the history file to
  load. History file are JSON representation of you conversation.
- **Clear**: It clear the history reset the current session.
- **Save**: This button is used to save the current session into a file. The file is a JSON
  representation of the conversation. File extension is `.lllh`
- **Slider**: This slider is used to control the temperature of the next user prompt.

  > #
  >
  > ### Temperature
  >
  > The temperature parameter in Large Language Models (LLMs) is used to control the
  > "temperature" or randomness of the generated text, which affects the model's fluency and
  > creativity. Higher temperatures lead to more diverse and creative outputs, while lower
  > temperatures result in more coherent but less novel text. Think of it like a thermostat for
  > your AI's writing style!
  >
  > - **Low Temperature (.01 - .7)** – Setting the temperature to a value of less than .7 makes
  >   the model’s output more deterministic and repetitive.
  > - **Mid Temperature (.7 - 1.3)** – Promotes creative and diverse text generation, but may
  >   result in less coherent or grammatically correct output.
  > - **High Temperature (>1.3)** – Very creatives text generation, it can result in incoherent
  >   answer, or repetitive loops inside generated text.
  > - **Default Temperature (0)** – Extremly determinitic, no fantasy. The model generates text
  >   that is the most predictable, based on the probability distribution learned during its
  >   training.
  >
  > ##

- **Model name**: This toggle button is used to display extended informations about the model.

### Extended informations

By clicking on the **Model name** button, you will be able to see the following informations
about the currently selected model.

<p align="left">
  <img height="350px" style="padding:10px;" src="./.github/l-v-settings_55.webp" />
</p>

You can update the system prompt in here:

<p align="left">
  <img height="280px" style="padding:10px;" src="./.github/zoom-sprompt_55.webp" />
</p>

> ##
>
> ### System prompt
>
> A system prompt in Large Language Models (LLMs) is a specific instruction or question that
> helps the model understand the context and goals of the task it's being asked to perform.
>
> ##

## How it works

Local Llama uses a combination of electron and llama-node-cpp to run Llama 3 models locally on
your machine. The app interacts with the llama-node-cpp library, which wraps the Llama 3 model
in a node.js module. This allows for seamless integration with electron and native code.

## Use from source

### Copy

Clone this git repository.

```bash
$ git clone https://github.com/tib0/Local-Llama
```

### Install

```bash
$ npm i
```

### Development

```bash
$ npm run start
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

### Requirements

**Node.js (22.x or higher)** - Local Llama requires a compatible version of Node.js to run.

**Npm (10.x or higher)** - Local Llama requires a compatible version of npm to run.

**GGUF Model** - Local Llama uses the llama-cpp as its core AI engine. It can use any gguf
models. If you want, you can find model at
[Hugginface](https://huggingface.co/models?search=gguf)

**8GB RAM** - While it depends on the model size, it is recommended to have at least 8GB RAM to
run this app.

## Dependencies

- **electron-forge-plugin-vite-esm** by _fozziethebeat_: Fix the issue with esm interop embeded
  in electron app [here](https://github.com/fozziethebeat/electron-forge-plugin-vite-esm).

- **node-llama-cpp v3.0.0-beta** by _withcatai_: Awsome node wrapper for llama
  [here](https://github.com/withcatai/node-llama-cpp).

- **Typescript v5.x**

- **React and React dom v18.x**

- **Electron v31.x**

- **Electron Store v8.x**

- **Forge v7.x**

- **Tailwind CSS v3.x**

- **DaisyUI v4.x**

- **Prettier v3.x**

- **React Markdown v9.x**

- **React Syntac Higlighter v15.x**

- **Rehype v15.x**

- **Remix v15.x**

- **uuid v10.x**

## License

> ##
>
> #### You are free to:
>
> - **Share** — copy and redistribute the material in any medium or format. The licensor cannot
>   revoke these freedoms as long as you follow the license terms.
>
> #### Under the following terms:
>
> - **Attribution** — You must give appropriate credit , provide a link to the license, and
>   indicate if changes were made . You may do so in any reasonable manner, but not in any way
>   that suggests the licensor endorses you or your use.
> - **Non Commercial** — You may not use the material for commercial purposes .
> - **No Derivatives** — If you remix, transform, or build upon the material, you may not
>   distribute the modified material.
> - **No additional restrictions** — You may not apply legal terms or technological measures
>   that legally restrict others from doing anything the license permits.
>
> #### Notices:
>
> You do not have to comply with the license for elements of the material in the public domain
> or where your use is permitted by an applicable exception or limitation.
>
> #### No warranties are given:
>
> The license may not give you all of the permissions necessary for your intended use. For
> example, other rights such as publicity, privacy, or moral rights may limit how you use the
> material.
>
> ##
>
> _Find out more [here](./LICENCE.md)_

# Have fun exploring Local Llama!

<p align="center">
  <img src="./.github/logo_50.webp" />
</p>
