import { useState, useEffect, useRef, useContext } from "react";
import { LlamaCppInfo } from "../lib/llamaNodeCppWrapper";
import { MicIcon } from "../lib/icons";
import { ChatContext } from "../providers/chat";

function ModelInfos({ model }: { model: string }) {
  const [modelInfo, setModelInfo] = useState<LlamaCppInfo>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>(null);
  const [checked, setChecked] = useState<boolean>(false);

  const modelName =
    model.split("/").length > 0
      ? model.split("/")[model.split("/").length - 1]
      : "Missing model";

  async function getModelInfo() {
    const mi = await window.electronAPI.getModelInfo();
    setModelInfo(JSON.parse(mi) as LlamaCppInfo);
  }

  const interval = useRef(null);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    interval.current = setInterval(async () => {
      await getModelInfo();
    }, 500);
    return () => clearInterval(interval.current);
  }, []);

  const getStatusColor = (label: string) => {
    switch (label) {
      case "uninitialized":
        return "bg-gray-700";
      case "ready":
        return "bg-green-500";
      case "loading":
        return "bg-yellow-400";
      case "generating":
        return "bg-orange-400";
      case "error":
        return "bg-red-500";
      case "garbage":
        return "bg-blue-500";
    }
  };

  async function sendSystemPrompt() {
    await window.electronAPI.changeModelSystemPrompt(systemPrompt);
    const mi = await window.electronAPI.getModelInfo();
    setModelInfo(JSON.parse(mi) as LlamaCppInfo);
    setSystemPrompt("");
    setChecked(false);
    dispatch({
      type: "CLEAR_HISTORY",
    });
  }

  return (
    <div className="collapse bg-base-100/20 bg-opacity-50 backdrop-blur-lg w-full border-base-300/30 bordered border-2 shadow-xl rounded-xl">
      <input
        type="checkbox"
        className="peer"
        checked={checked}
        onClick={() => setChecked(!checked)}
      />
      <div className="collapse-title px-4 md:pr-8">
        <div className="flex items-center justify-between">
          <p className="text-lg text-left font-bold text-primary">{modelName}</p>

          <div className="text-lg text-right font-bold text-primary -rotate-90">
            {modelInfo && modelInfo.status.label && (
              <div
                className={`
                animate-pulse rounded-full h-3 w-3 duration-1000 delay-1000 transition-colors
                ${getStatusColor(modelInfo.status.label)}
              `}
              />
            )}
          </div>
        </div>
      </div>
      <div className="collapse-content text-primary-content peer-checked:text-base-content">
        <div className="flex flex-col gap-4 text-xs md:text-lg items-center justify-stretch">
          {modelInfo && modelInfo.llama && (
            <div className="stats h-24 text-sm bg-opacity-50 backdrop-blur-lg border-primary/70 bordered border-2 w-full rounded-2xl text-center bg-primary text-primary-content stats-vertical sm:stats-horizontal shadow-lg">
              <div className="stat">
                <div className="stat-title">Used VRAM</div>
                <div className="stat-value">
                  {(modelInfo.llama.vramState.used * 1e-9).toFixed(1) + " GB"}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Free VRAM</div>
                <div className="stat-value">
                  {(modelInfo.llama.vramState.free * 1e-9).toFixed(1) + " GB"}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Total VRAM</div>
                <div className="stat-value">
                  {(modelInfo.llama.vramState.total * 1e-9).toFixed(1) + " GB"}
                </div>
              </div>
            </div>
          )}
          {modelInfo && modelInfo.context && modelInfo.model && (
            <div className="stats text-center w-full bg-base-100 text-primary-content stats-vertical sm:stats-horizontal shadow-lg">
              <div className="stat h-24 text-sm border-base-content/70 border-2 bg-base-300 bg-opacity-90 backdrop-blur-lg rounded-t-2xl sm:rounded-tr-none sm:rounded-bl-2xl">
                <div className="stat-title text-primary">Train context size</div>
                <div className="stat-value text-primary">
                  {(modelInfo.model.trainContextSize * 1e-3).toFixed(1) + " GB"}
                </div>
              </div>
              <div className="stat h-24 text-sm border-base-content/70 border-2 bg-base-content bg-opacity-90 backdrop-blur-lg rounded-t-none sm:rounded-tr-2xl sm:rounded-l-none">
                <div className="stat-value text-secondary">
                  {modelInfo.context.sequencesLeft + "/" + modelInfo.context.totalSequences}
                </div>
                <div className="stat-title text-secondary">Sequences Left</div>
              </div>
            </div>
          )}
          {modelInfo && modelInfo.context && (
            <div className="stats h-24 text-sm bg-opacity-50 backdrop-blur-lg border-secondary/70 bordered border-2 w-full rounded-2xl text-center bg-secondary text-primary-content stats-vertical sm:stats-horizontal shadow-lg">
              <div className="stat">
                <div className="stat-title ">Batch Size</div>
                <div className="stat-value">
                  {(modelInfo.context.batchSize * 1e-3).toFixed(1) + " GB"}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Context Size</div>
                <div className="stat-value">
                  {(modelInfo.context.contextSize * 1e-3).toFixed(1) + " GB"}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">State Size</div>
                <div className="stat-value">
                  {(modelInfo.context.stateSize * 1e-9).toFixed(1) + " GB"}
                </div>
              </div>
            </div>
          )}
        </div>

        {modelInfo && modelInfo.status?.label && modelInfo.status.label === "error" ? (
          <div
            className={`p-2 bg-error/30 border border-error/70 rounded-md flex flex-col shadow-xl`}
          >
            <span className="text-lg font-semibold">{modelInfo.status.message}</span>
            <span className="text-md font-light">
              {"You might want to try the followings :"}
              <ul className="list-disc ml-8">
                <li>{"Update the model by clicking on model button"}</li>
                <li>{"Change the gpu processor from the drop down list"}</li>
                <li>{"Clear the history, model migth have reached the max context size"}</li>
                <li>
                  {"Free up some memory by closing other applications or background services"}
                </li>
                <li>{"Restart the application"}</li>
              </ul>
            </span>
          </div>
        ) : model || model === "" ? (
          <p className="text-lg py-4 font-light">{model}</p>
        ) : (
          <p className="text-lg py-4 font-light">{"Missing model"}</p>
        )}

        <div className="collapse bg-base-100/20 bg-opacity-50 backdrop-blur-lg w-full border-base-300/30 bordered border-2 shadow-xl rounded-xl">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-extrabold">Set system prompt...</div>
          <div className="collapse-content">
            <div className="prose">
              <div className="font-semibold">
                This is the current system prompt, input a new one below if you want, be
                creative ! The session will be reseted after System Prompt update.
              </div>
              <blockquote>
                {modelInfo && modelInfo.context && (
                  <>
                    <p className="font-light text-base-content/60">
                      {modelInfo.context.systemPrompt}
                    </p>
                  </>
                )}
              </blockquote>
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
                  id="system-prompt-input"
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
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    {
                      if (e.which == 13) {
                        e.preventDefault();
                        e.stopPropagation();
                        sendSystemPrompt();
                      }
                    }
                  }}
                  value={systemPrompt}
                  //disabled={loading}
                />
                <div className="hidden justify-center sm:flex w-2/12">
                  <kbd
                    role="button"
                    className="kbd kbd-sm hover:cursor-pointer focus:ring-primary/30"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      sendSystemPrompt();
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
                      sendSystemPrompt();
                    }}
                  >
                    <MicIcon />
                  </button>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between pt-4 text-base-content/20">
          {modelInfo && modelInfo.llama && (
            <span className="text-sm font-bold italic">
              {modelInfo.llama.deviceNames + " - " + modelInfo.llama.gpu}
            </span>
          )}

          {modelInfo && <span className="text-sm font-extralight italic">{modelInfo.id}</span>}
        </div>
      </div>
    </div>
  );
}

export default ModelInfos;
