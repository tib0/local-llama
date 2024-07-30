import { useState, useEffect, useMemo, useRef, useContext } from "react";
import debounce from "lodash.debounce";
import { LlamaCppInfo } from "../lib/llamaNodeCppWrapper";
import { MicIcon, WarningIcon } from "../lib/icons";
import { ChatContext } from "../providers/chat";
import images from "../lib/images";
import { titleCase } from "../lib/text";
import { getSep } from "../lib/os";

function ModelInfos({ model }: { model: string }) {
  const [modelInfo, setModelInfo] = useState<LlamaCppInfo>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0);
  const [expandedView, setExpandedView] = useState<boolean>(false);
  const [tempIco, setTempIco] = useState<string>(images.blue);
  const interval = useRef(null);
  const { dispatch } = useContext(ChatContext);
  const pathSeparator = getSep();

  const modelName =
    model.split(pathSeparator).length > 0
      ? model.split(pathSeparator)[model.split(pathSeparator).length - 1]
      : "Missing model";

  async function getModelInfo() {
    const mi = await window.electronAPI.getModelInfo();
    setModelInfo(JSON.parse(mi) as LlamaCppInfo);
  }

  const defineTempIco = (temp: number) => {
    if (temp) {
      switch (true) {
        case temp > 80:
          setTempIco(images.red);
          break;
        case temp > 50:
          setTempIco(images.yellow);
          break;
        case temp > 30:
          setTempIco(images.green);
          break;
        case temp > 15:
          setTempIco(images.blue);
          break;
        case temp > 0:
          setTempIco(images.blue);
          break;
        default:
          setTempIco(images.blue);
          break;
      }
    }
  };

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

  async function changeDocument() {
    await window.electronAPI.selectDocumentToParse();
  }

  const sendTemperature = async (e) => {
    await window.electronAPI.changeTemperature(
      parseFloat((Number(e.target.value) / 50).toFixed(2)),
    );
  };

  const debouncedRangeChangeHandler = useMemo(() => debounce(sendTemperature, 600), []);

  useEffect(() => {
    interval.current = setInterval(async () => {
      await getModelInfo();
    }, 2000);
    return () => {
      debouncedRangeChangeHandler.cancel();
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    if (!temperature || isNaN(temperature)) setTemperature(modelInfo?.llama?.temperature * 50);
    defineTempIco(temperature ?? 0);
  }, [modelInfo?.llama?.temperature, temperature]);

  useEffect(() => {
    setTemperature(modelInfo?.llama?.temperature * 50);
    defineTempIco(modelInfo?.llama?.temperature * 50);
  }, [modelInfo?.model?.filename, modelInfo?.llama?.temperature]);

  return (
    <div className="flex flex-col w-full">
      <div className="collapse bg-base-100/20 bg-opacity-50 backdrop-blur-lg w-full border-base-300/30 bordered border-2 shadow-xl rounded-xl">
        <input
          type="checkbox"
          className="peer"
          tabIndex={-1}
          checked={expandedView}
          readOnly
          onClick={() => setExpandedView(!expandedView)}
        />
        <div className="collapse-title px-4 md:pr-8">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-primary flex items-center gap-1 justify-between">
              {modelName + " "}
              {modelInfo && modelInfo?.status?.warning && <WarningIcon />}
            </div>

            <div className="text-lg text-right items-center justify-center font-bold text-primary flex">
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
                typeof modelInfo.llama.temperature === "number" &&
                !isNaN(modelInfo?.llama?.temperature) && (
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
              {modelInfo && modelInfo.status && modelInfo?.status?.warning && (
                <div className="flex flex-col bg-warning/20 bg-opacity-30 backdrop-blur-lg w-full border-warning/40 bordered border-2 shadow-md rounded-xl p-2 mt-4">
                  <div className="w-full">
                    <span className="text-base font-normal text-base-content flex justify-start items-center gap-1">
                      <WarningIcon strokeColor="oklch(var(--bc))" />
                      Warning:
                    </span>
                    <span
                      className={`
                            text-base font-light text-base-content/90
                          `}
                    >
                      {" " + modelInfo.status.warning}
                    </span>
                  </div>
                </div>
              )}
              <div className="collapse mt-4 bg-base-100/20 bg-opacity-50 backdrop-blur-lg w-full border-base-300/30 bordered border-2 shadow-md rounded-xl">
                <input type="checkbox" tabIndex={-1} />
                <div className="collapse-title text-xl font-extrabold">
                  Set system prompt...
                </div>
                <div className="collapse-content">
                  <div className="prose max-w-full">
                    <div className="font-medium leading-6">
                      This is the current system prompt, input a new one below if you want, be
                      creative ! The session will be reseted after System Prompt update.
                      {modelInfo &&
                        modelInfo.context &&
                        modelInfo.context.systemPrompt.length > 1000 && (
                          <>{` ${(modelInfo.context.systemPrompt.length - 1000).toLocaleString()} characters hidden from below text.`}</>
                        )}
                    </div>
                    <blockquote>
                      {modelInfo && modelInfo.context && (
                        <>
                          <p className="font-light text-base-content/60">
                            {modelInfo.context.systemPrompt.slice(0, 999)}
                            {modelInfo.context.systemPrompt.length > 1000 && <>{` (...)`}</>}
                          </p>
                        </>
                      )}
                    </blockquote>
                  </div>
                  <div className="flex flex-col justify-center">
                    <label
                      className={`
                        bg-base-100 h-20 my-2
                        border-primary/30 bordered border-2 
                        shadow-xl rounded-xl flex items-center 
                        transition-all justify-between
                      `}
                    >
                      <textarea
                        id="system-prompt-input"
                        autoComplete="on"
                        spellCheck={true}
                        tabIndex={-1}
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
                            if (e.key == "Enter") {
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
                    <div className="font-medium leading-6 text-md pt-4 text-base-content/75">
                      You can upload a document to provide system prompt content by clicking
                      the following button. Up to 16K characters are retained, any excess will
                      be ignored. Support docx, pptx, xlsx, odt, odp, ods, pdf and txt
                      documents.
                      <div className="w-full flex justify-end">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm shadow-xl"
                          aria-label="Load another document"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            changeDocument();
                          }}
                        >
                          Document...
                        </button>
                      </div>
                    </div>
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
          <div
            className="tooltip"
            data-tip={(temperature ? temperature / 50 : 0).toLocaleString()}
          >
            <div className="w-16 flex flex-grow-0 items-center justify-center">
              <div className="bg-base-100/90 w-8 h-10 border-primary border-[3px] rounded-t-full rounded-b-md overflow-hidden">
                <img className="mt-[-4px]" src={tempIco} />
              </div>
            </div>
          </div>
          <div className="flex-grow-1 w-full">
            <input
              name="temperature"
              type="range"
              min={0}
              max="100"
              value={isNaN(temperature) ? 0 : temperature}
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
          <div className="w-16 flex flex-grow-0 items-center justify-center">
            <div className="skeleton bg-base-100/90 w-8 h-10 border-primary border-[3px] rounded-t-full rounded-b-md overflow-hidden" />
          </div>
          <div className="flex-grow-1 w-full text-center flex items-center justify-center">
            <div className="skeleton h-4 w-full ml-4" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelInfos;
