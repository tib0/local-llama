import { useContext, useEffect, useRef, useState } from "react";
import ChatBubbleSkeleton from "./chat/chat-bubble-skeleton";
import ChatBubbleModel from "./chat/chat-bubble-model";
import ChatBubbleUser from "./chat/chat-bubble-user";
import ChatBubbleSystem from "./chat/chat-bubble-system";
import { MicIcon } from "../lib/icons";
import { ChatHistoryItem } from "../lib/llamaNodeCppWrapper";
import { ChatContext } from "../providers/chat";
import { v4 as uuidv4 } from "uuid";
import usePersistentStorageValue from "../hooks/usePersistentStorageValue";
import ModelInfos from "./model-infos";

type ObjectWithStrings = {
  [index: string]: any[];
};

const showNotification = (m?: string) => {
  new Notification(`L³`, {
    body: m ?? "Notification from L³",
    tag: uuidv4(),
  });
};

const ChatForm = () => {
  const [error, setError] = useState<ObjectWithStrings>({
    title: [],
  });
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [currentModel, setCurrentModel] = usePersistentStorageValue<string | undefined>(
    "currentModel",
  );
  const [model, setModel] = useState<string | undefined>(currentModel);
  const { dispatch } = useContext(ChatContext);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    state: { history: chatHistory },
  } = useContext(ChatContext);

  function init() {
    setPrompt("");
    setLoading(false);
    setError({});
  }

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
    window.electronAPI.onModelChange((modelPath) => {
      if (!modelPath) {
        return;
      }
      setModel(modelPath);
      setCurrentModel(modelPath);
    });
  }, [loading]);

  async function sendPrompt() {
    if (
      loading ||
      prompt === undefined ||
      prompt.trim() === "" ||
      prompt.split(" ").length < 2
    )
      return;

    dispatch({
      type: "PROMPT_CHAT",
      payload: [{ type: "user", text: prompt }] as ChatHistoryItem[],
    });

    init();
    setLoading(true);

    await window.electronAPI.chat(prompt).then((response: string) => {
      if (response) {
        dispatch({
          type: "PROMPT_CHAT",
          payload: [{ type: "model", response: [response] }] as ChatHistoryItem[],
        });
      }
    });
    setLoading(false);
  }

  async function clearHistory() {
    dispatch({
      type: "CLEAR_HISTORY",
    });
    window.electronAPI.clearHistory();
    showNotification("History deleted!");
  }

  async function changeModel() {
    setLoading(true);
    window.electronAPI.changeModel();
    setLoading(false);
    showNotification("Model updated!");
  }

  useEffect(() => {
    setHistory(chatHistory);
  }, [chatHistory]);

  return (
    <form
      name="chatLlama"
      id="chatLlama"
      className="w-full"
      onKeyDown={(e) => {
        {
          if (e.which == 13) {
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
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-primary btn-sm shadow-xl"
            aria-label="Change model"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              changeModel();
            }}
          >
            Change model
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm shadow-xl"
            aria-label="Change model"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clearHistory();
            }}
          >
            Clear
          </button>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm shadow-xl"
          aria-label="Change model"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            //todo
          }}
        >
          Save
        </button>
      </div>
      <div className="flex justify-start gap-2 items-center w-full pt-3 pb-1 px-0">
        {model ? (
          <ModelInfos model={model} />
        ) : (
          "Missing model, read the instruction if needed"
        )}
      </div>
      <div className="flex flex-col justify-center">
        <label
          className={`
            sticky z-10 top-16 bg-base-100 h-20 my-2
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
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            disabled={loading}
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
        {loading && <ChatBubbleSkeleton />}
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
                <ChatBubbleSystem
                  key={index.toString()}
                  index={index.toString()}
                  text={c.text as string}
                />
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
