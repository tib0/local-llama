import { useState, useEffect, useMemo, useRef, useContext } from "react";
import debounce from "lodash.debounce";
import { LlamaCppInfo } from "../lib/llamaNodeCppWrapper";
import { MicIcon } from "../lib/icons";
import { ChatContext } from "../providers/chat";
import images from "../lib/images";
import { titleCase } from "../lib/text";

function ModelInfos({ model }: { model: string }) {
  const [modelInfo, setModelInfo] = useState<LlamaCppInfo>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0);
  const [expandedView, setExpandedView] = useState<boolean>(false);
  const [tempIco, setTempIco] = useState<any>(null);

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
    return () => {
      debouncedRangeChangeHandler.cancel();
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    if (!temperature) setTemperature(modelInfo?.llama?.temperature * 50 ?? 0);

    if (temperature) {
      switch (true) {
        case temperature === 0:
          setTempIco(images.fire);
          break;
        case temperature > 80:
          setTempIco(images.red);
          break;
        case temperature > 50 && temperature < 81:
          setTempIco(images.pink);
          break;
        case temperature > 35 && temperature < 51:
          setTempIco(images.green);
          break;
        case temperature > 15 && temperature < 36:
          setTempIco(images.gray);
          break;
        case temperature > 0 && temperature < 16:
          setTempIco(images.blue);
          break;
        default:
          setTempIco(images.fire);
          break;
      }
    }
  }, [modelInfo?.llama?.temperature, temperature]);

  useEffect(() => {
    setTemperature(modelInfo?.llama?.temperature * 50);
    const temp = modelInfo?.llama?.temperature * 50;
    switch (true) {
      case temp === 0:
        setTempIco(images.fire);
        break;
      case temp > 80:
        setTempIco(images.red);
        break;
      case temp > 50 && temp < 81:
        setTempIco(images.pink);
        break;
      case temp > 35 && temp < 51:
        setTempIco(images.green);
        break;
      case temp > 15 && temp < 36:
        setTempIco(images.gray);
        break;
      case temp > 0 && temp < 16:
        setTempIco(images.blue);
        break;
      default:
        setTempIco(images.fire);
        break;
    }
  }, [modelInfo?.model?.filename, modelInfo?.llama?.temperature]);

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
    setExpandedView(false);
    dispatch({
      type: "CLEAR_HISTORY",
    });
  }

  const sendTemperature = async (e) => {
    await window.electronAPI.changeTemperature(
      parseFloat((Number(e.target.value) / 50).toFixed(2)),
    );
  };

  const debouncedRangeChangeHandler = useMemo(() => debounce(sendTemperature, 600), []);

  return (
    <div className="flex flex-col w-full">
      <div className="collapse bg-base-100/20 bg-opacity-50 backdrop-blur-lg w-full border-base-300/30 bordered border-2 shadow-xl rounded-xl">
        <input
          type="checkbox"
          className="peer"
          checked={expandedView}
          readOnly
          onClick={() => setExpandedView(!expandedView)}
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
                    {
                      "Free up some memory by closing other applications or background services"
                    }
                  </li>
                  <li>{"Restart the application"}</li>
                </ul>
              </span>
            </div>
          ) : model && model !== "" ? (
            <>
              <p className="text-base font-normal text-base-content/90">{"File location:"}</p>
              <p className="text-base font-light text-base-content/70">{model}</p>

              {modelInfo &&
                modelInfo.llama &&
                typeof modelInfo.llama.temperature === "number" && (
                  <div className="flex flex-col items-center justify-stretch w-full pt-4">
                    <div className="w-full">
                      <span className="text-base font-normal text-base-content/90">
                        Current temperature:
                      </span>
                      <span
                        className={`
                        text-base font-light text-base-content/70
                      `}
                      >
                        {" " + modelInfo.llama.temperature}
                      </span>
                    </div>
                  </div>
                )}
              <div className="collapse mt-4 bg-base-100/20 bg-opacity-50 backdrop-blur-lg w-full border-base-300/30 bordered border-2 shadow-md rounded-xl">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-extrabold">
                  Set system prompt...
                </div>
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
            </>
          ) : (
            <p className="text-lg pt-4 font-light">{"Missing model"}</p>
          )}
          <div className="flex flex-col pt-4 gap-4 text-xs md:text-lg items-center justify-stretch">
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

          <div className="flex flex-col sm:flex-row justify-between pt-4 text-base-content/30">
            {modelInfo && modelInfo.llama && (
              <span className="text-sm font-bold italic">
                {modelInfo.llama.deviceNames && modelInfo.llama.gpu
                  ? modelInfo.llama.deviceNames + " - " + titleCase(modelInfo.llama.gpu)
                  : modelInfo.llama.gpu === false
                    ? "No GPU"
                    : ""}
              </span>
            )}

            {modelInfo && (
              <span className="text-sm font-extralight italic">{modelInfo.id}</span>
            )}
          </div>
        </div>
      </div>
      {modelInfo && modelInfo.llama && typeof modelInfo.llama.temperature === "number" ? (
        <div className="flex flex-row items-center justify-between w-full pt-4 pr-3">
          <div className="flex-grow-0 w-16 text-center flex items-center justify-center font-black text-lg transition-all">
            <img
              className="w-7 h-8 bg-white/90 mb-1 rounded-full border-[3px] border-primary"
              src={tempIco}
            />
          </div>
          <div className="flex-grow-1 w-full">
            <input
              name="temperature"
              type="range"
              min={0}
              max="100"
              value={temperature}
              className="range range-lg range-primary"
              onChange={(e) => {
                setTemperature(e.target.value as any);
                debouncedRangeChangeHandler(e);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-between w-full pt-4 pr-3">
          <div className="flex-grow-0 w-16 text-center flex items-center justify-center font-black text-lg transition-all">
            <div className="skeleton w-7 h-8 bg-white/90 mb-1 rounded-full border-[3px] border-primary" />
          </div>
          <div className="flex-grow-1 w-full text-center flex items-center justify-center">
            <div className="skeleton h-8 w-full" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelInfos;
