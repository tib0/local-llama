import { useState, useEffect } from "react";
import { LlamaCppInfo } from "../lib/llamaNodeCppWrapper";
import { ArrowDownIcon } from "../lib/icons";

function ModelInfos({ model }: { model: string }) {
  const [modelInfo, setModelInfo] = useState<LlamaCppInfo>(null);
  const modelName =
    model.split("/").length > 0
      ? model.split("/")[model.split("/").length - 1]
      : "Missing model";
  async function getModelInfo() {
    const mi = await window.electronAPI.getModelInfo();
    setModelInfo(JSON.parse(mi) as LlamaCppInfo);
  }
  useEffect(() => {
    const interval = setInterval(async () => {
      await getModelInfo();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="collapse bg-base-100/20 bg-opacity-50 backdrop-blur-lg w-full border-base-300/30 bordered border-2 shadow-xl rounded-xl">
      <input type="checkbox" className="peer" />
      <div className="collapse-title">
        <div className="flex items-center justify-between">
          <p className="text-lg text-left font-bold text-primary">{modelName}</p>
          <p className="text-lg text-right font-bold text-primary -rotate-90 peer-checked:-rotate-45">
            <ArrowDownIcon />
          </p>
        </div>
      </div>
      <div className="collapse-content text-primary-content peer-checked:text-base-content">
        <div className="flex flex-col gap-4 pb-4 text-xs md:text-lg items-center justify-stretch">
          {modelInfo && modelInfo.context && (
            <div className="stats bg-opacity-50 backdrop-blur-lg border-secondary/70 bordered border-2 w-full rounded-2xl text-center bg-secondary text-primary-content stats-vertical sm:stats-horizontal shadow-lg">
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
          {modelInfo && modelInfo.context && modelInfo.model && (
            <div className="stats text-center w-full bg-base-100 text-primary-content stats-vertical sm:stats-horizontal shadow-lg">
              <div className="stat border-base-content/70 border-2 bg-base-300 bg-opacity-90 backdrop-blur-lg rounded-t-2xl sm:rounded-tr-none sm:rounded-bl-2xl">
                <div className="stat-title text-primary">Train context size</div>
                <div className="stat-value text-primary">
                  {(modelInfo.model.trainContextSize * 1e-3).toFixed(1) + " GB"}
                </div>
              </div>
              <div className="stat border-base-content/70 border-2 bg-base-content bg-opacity-90 backdrop-blur-lg rounded-t-none sm:rounded-tr-2xl sm:rounded-l-none">
                <div className="stat-value text-secondary">
                  {modelInfo.context.sequencesLeft + "/" + modelInfo.context.totalSequences}
                </div>
                <div className="stat-title text-secondary">Sequences Left</div>
              </div>
            </div>
          )}
          {modelInfo && modelInfo.llama && (
            <div className="stats bg-opacity-50 backdrop-blur-lg border-primary/70 bordered border-2 w-full rounded-2xl text-center bg-primary text-primary-content stats-vertical sm:stats-horizontal shadow-lg">
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
        </div>
        {model ? (
          <p className="text-lg pb-4 font-light">{model}</p>
        ) : (
          <p className="text-lg pb-4 font-light">{"Missing model"}</p>
        )}
        <div className="flex flex-col sm:flex-row justify-between">
          {modelInfo && modelInfo.llama && (
            <span className="text-sm font-bold italic">{modelInfo.llama.deviceNames}</span>
          )}
          {modelInfo && <span className="text-sm font-extralight italic">{modelInfo.id}</span>}
        </div>
      </div>
    </div>
  );
}

export default ModelInfos;
