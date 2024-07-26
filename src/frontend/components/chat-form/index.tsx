import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import ChatBubbleSkeleton from "./chat-bubble-skeleton";
import ChatBubbleUser from "./chat-bubble-user";
import ChatBubbleSystem from "./chat-bubble-system";
import { MicIcon } from "../../lib/icons";
import { ChatHistoryItem } from "../../lib/llamaNodeCppWrapper";
import { ChatContext } from "../../providers/chat";
import usePersistentStorageValue from "../../hooks/usePersistentStorageValue";
import ModelInfos from "../model-infos";
import ChatBubbleModel from "./chat-bubble-model";
import { isMac } from "../../lib/os";

type ObjectWithStrings = {
  [index: string]: any[];
};

const MAX_PROMPT_HISTORY_ITEM = 4;

const ChatForm = () => {
  const [error, setError] = useState<ObjectWithStrings>({
    title: [],
  });
  const [prompt, setPrompt] = useState<string>("");
  const [loadingPrompt, setLoadingPrompt] = useState<boolean>(false);
  const [loadedChunk, setLoadedChunk] = useState<string>("");
  const [loadedPromptChunks, setLoadedPromptChunks] = useState<string>("");
  const [loadingModel, setLoadingModel] = useState<boolean>(false);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [currentHistoryPromptIndex, setCurrentHistoryPromptIndex] =
    useState<number>(undefined);
  const [promptHistory, setPromptHistory] = usePersistentStorageValue<string[] | undefined>(
    "promptHistory",
  );
  const [currentModel, setCurrentModel] = usePersistentStorageValue<string | undefined>(
    "currentModel",
  );
  const [_currentGpuUse, setCurrentGpuUse] = usePersistentStorageValue<string | undefined>(
    "currentGpuUse",
  );
  const { dispatch } = useContext(ChatContext);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    state: { history: chatHistory },
  } = useContext(ChatContext);

  function init() {
    setPrompt("");
    setLoadingPrompt(false);
    setError({});
  }

  async function sendPrompt() {
    if (
      loadingPrompt ||
      loadingModel ||
      prompt === undefined ||
      prompt.trim() === "" ||
      prompt.split(" ").length < 2
    )
      return;

    dispatch({
      type: "PROMPT_CHAT",
      payload: [{ type: "user", text: prompt }] as ChatHistoryItem[],
    });

    let newPromptHistory = promptHistory ?? [""];
    if (!newPromptHistory.includes(prompt)) newPromptHistory.push(prompt);
    if (newPromptHistory.length > MAX_PROMPT_HISTORY_ITEM + 1) {
      newPromptHistory = newPromptHistory.slice(-1 * MAX_PROMPT_HISTORY_ITEM);
      newPromptHistory.unshift("");
    }
    setPromptHistory(newPromptHistory);

    init();
    setLoadingPrompt(true);

    const start = Date.now();
    await window.electronAPI.chat(prompt).then((response: string) => {
      if (response) {
        const end = Date.now();
        const elapsed = new Date(end - start).toISOString().substring(11, 11 + 8);
        dispatch({
          type: "PROMPT_CHAT",
          payload: [
            { type: "model", response: [response + "\n\n" + elapsed] },
          ] as ChatHistoryItem[],
        });
      }
    });
    setLoadingPrompt(false);
  }

  async function clearHistory() {
    dispatch({
      type: "CLEAR_HISTORY",
    });
    await window.electronAPI.clearHistory();
  }

  async function abortPrompt() {
    setLoadedChunk("");
    setLoadedPromptChunks("");
    await window.electronAPI.abortPrompt();
  }

  async function changeModel() {
    setLoadingModel(true);
    await window.electronAPI.changeModel();
  }

  const handleSelectGpuChange = (e: ChangeEvent<HTMLSelectElement>) => {
    switch (e.target?.value) {
      case "auto":
        setCurrentGpuUse("auto");
        window.electronAPI.changeModelGpuUse("auto");
        break;
      case "cuda":
        setCurrentGpuUse("cuda");
        window.electronAPI.changeModelGpuUse("cuda");
        break;
      case "vulkan":
        setCurrentGpuUse("vulkan");
        window.electronAPI.changeModelGpuUse("vulkan");
        break;
      case "metal":
        setCurrentGpuUse("metal");
        window.electronAPI.changeModelGpuUse("metal");
        break;
      case "false":
        setCurrentGpuUse("false");
        window.electronAPI.changeModelGpuUse("false");
        break;
    }
  };

  async function handleSaveHistory() {
    const res = await window.electronAPI.saveHistory();
    if (res === "") console.warn("Save history failed");
  }

  async function handleLoadHistory() {
    const res = await window.electronAPI.loadHistory();
    if (!res || res === "") {
      console.warn("Load history failed");
      return;
    }
    const histArray = Object.keys(res).map((key) => res[key]);
    dispatch({
      type: "LOAD_CHAT",
      payload: histArray,
    });
  }

  useEffect(() => {
    if (Number.isInteger(currentHistoryPromptIndex))
      setPrompt(promptHistory[currentHistoryPromptIndex]);
  }, [currentHistoryPromptIndex]);

  useEffect(() => {
    setHistory(chatHistory);
  }, [chatHistory]);

  useEffect(() => {
    if (loadedChunk && loadedChunk !== "") {
      setLoadedPromptChunks(loadedPromptChunks + loadedChunk);
    }
  }, [loadedChunk]);

  useEffect(() => {
    if (!loadingPrompt) {
      setLoadedChunk("");
      setLoadedPromptChunks("");
      inputRef.current?.focus();
    }
  }, [loadingPrompt]);

  useEffect(() => {
    window.electronAPI.onModelChange((modelPath) => {
      if (modelPath && modelPath !== "") {
        setCurrentModel(modelPath);
        dispatch({
          type: "CLEAR_HISTORY",
        });
      }
      setLoadingModel(false);
    });
    window.electronAPI.onChunkReceive((newChunk) => {
      if (!newChunk) {
        return;
      }
      setLoadedChunk(newChunk);
    });
  }, [setLoadingModel, setLoadingModel]);

  return (
    <form
      name="chatLlama"
      id="chatLlama"
      className="w-full"
      onKeyDown={(e) => {
        {
          if (e.key == "Enter") {
            e.preventDefault();
            e.stopPropagation();
            sendPrompt();
          }
        }
      }}
    >
      <div
        className={`
          flex gap-2 w-full pt-3 
          flex-col sm:flex-row 
          justify-start sm:justify-between 
          items-start sm:items-center
        `}
      >
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="btn btn-primary btn-sm shadow-xl"
            aria-label="Load another model"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              changeModel();
            }}
          >
            Model...
          </button>
          <div className="flex gap-1 items-center rounded-md h-full">
            <select
              className="select select-bordered select-sm ml-1 shadow-xl"
              onChange={handleSelectGpuChange}
              defaultValue="auto"
            >
              <option value={"auto"}>Auto</option>
              {isMac() && <option value={"metal"}>Use Metal</option>}
              {!isMac() && <option value={"vulkan"}>Use Vulkan</option>}
              <option value={"cuda"}>Use Cuda</option>
              <option value={"false"}>No GPU</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-primary btn-sm shadow-xl"
            aria-label="Load old conversation from file"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLoadHistory();
            }}
          >
            History...
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm shadow-xl"
            aria-label="Change model"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (loadingPrompt) {
                abortPrompt();
              } else {
                clearHistory();
              }
            }}
          >
            {loadingPrompt ? "Stop" : "Clear"}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm shadow-xl"
            aria-label="Save conversation"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSaveHistory();
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className="flex justify-start gap-2 items-center w-full pt-3 pb-1 px-0">
        {loadingModel ? (
          <div className="text-lg font-bold text-primary">Loading model, please wait...</div>
        ) : currentModel && currentModel !== "" ? (
          <ModelInfos model={currentModel} />
        ) : (
          <div className="text-lg font-bold text-primary py-2">
            Missing model, read the instruction if needed
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center">
        <label
          className={`
            sticky z-10 top-[4.2rem] bg-base-100 h-20 my-2
            border-primary/30 bordered border-2 
            shadow-xl rounded-xl flex items-center 
            transition-all justify-between
          `}
        >
          <textarea
            id="chat-input"
            ref={inputRef}
            autoComplete="on"
            spellCheck={true}
            tabIndex={0}
            className={`
              w-full bg-transparent 
              textarea py-2 h-full textarea-ghost
              focus:border-none focus:outline-none text-base leading-7
              resize-none disabled:bg-transparent disabled:border-none
            `}
            rows={2}
            placeholder={`Start typing here, and press enter or click on the button`}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            onKeyDown={(e) => {
              if (
                promptHistory &&
                promptHistory.length > 0 &&
                e.altKey &&
                "|PageUp|PageDown|".includes("|" + e.key + "|")
              ) {
                const currentIndex = currentHistoryPromptIndex ?? 0;

                switch (e.key) {
                  case "PageDown":
                    setCurrentHistoryPromptIndex(
                      currentIndex - 1 == -1 ? promptHistory.length - 1 : currentIndex - 1,
                    );
                    break;
                  case "PageUp":
                    setCurrentHistoryPromptIndex(
                      currentIndex + 1 > promptHistory.length - 1 ? 0 : currentIndex + 1,
                    );
                    break;
                }
              }
            }}
            value={prompt}
            disabled={loadingPrompt || loadingModel}
          />
          <div className="hidden justify-center sm:flex w-2/12">
            <kbd
              role="button"
              className="kbd kbd-sm hover:cursor-pointer focus:ring-primary/30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sendPrompt();
              }}
            >
              Enter
            </kbd>
          </div>
          <div className="flex justify-center sm:hidden w-2/12">
            <button
              type="button"
              className={`
                focus:ring-primary/40
                focus:ring
                focus:outline-none
              `}
              aria-label="Start voice recording"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sendPrompt();
              }}
            >
              <MicIcon />
            </button>
          </div>
        </label>
        {loadingPrompt && <ChatBubbleSkeleton text={loadedPromptChunks} />}
        {history.toReversed().map((c: ChatHistoryItem, index) => {
          switch (c.type) {
            case "model":
              return (
                <ChatBubbleModel
                  key={index.toString()}
                  index={index.toString()}
                  text={c.response[0] as string}
                />
              );
            case "user":
              return (
                <ChatBubbleUser
                  key={index.toString()}
                  index={index.toString()}
                  text={c.text}
                />
              );
            case "system":
              return (
                <>
                  {/* <ChatBubbleSystem
                  key={index.toString()}
                  index={index.toString()}
                  text={c.text as string}
                /> */}
                </>
              );
            default:
              return (
                <ChatBubbleSystem
                  key={"Error"}
                  index={"Error"}
                  text={"History element not found"}
                />
              );
          }
        })}

        {error?.data?.length > 0 ? (
          <div className="card text-neutral-content border border-error bg-base-100">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Erreur !</h2>
              <div>{error.data[error.data.length - 1]}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </form>
  );
};

export default ChatForm;
