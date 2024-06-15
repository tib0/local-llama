import { Link } from "react-router-dom";
import React from "react";
import HomeLayout from "../layout/home";

function About(): JSX.Element {
  return (
    <HomeLayout>
      <React.Fragment>
        <title>Local Llama - About</title>
        <div
          className={`min-h-[calc(100vh-5rem)] text-center
          `}
        >
          <h1 className="py-8 font-black">About...</h1>
          <div>
            <div className="py-2">
              <p>This recreational project aim to help you run LLM models locally 🚀</p>
              <p>
                With local llama you can safely use Llama 3 models without needing to register
                to any exernal services.
              </p>
              <p>
                {
                  'You will be able to run gguf models. You can find them by searching for "gguf" at '
                }
                <a href="https://huggingface.co/models?search=gguf" target="_blank">
                  Hugginface.co
                </a>
              </p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p>
                This project would not have come to life without the amazing work done by the
                awsome teams and people :
              </p>
              <ul className="text-left list-none md:list-disc list-inside mx-4 py-2 max-w-lg">
                <li>
                  <a
                    href="https://github.com/fozziethebeat/electron-forge-plugin-vite-esm#plugin-vite-esm"
                    target="_blank"
                    className="font-black text-primary text-xl"
                  >
                    fozziethebeat
                  </a>
                  {
                    " from SurfaceData team, with plugin-vite-esm he'd tackle down complex integration of node-llama-cpp inside an electron app."
                  }
                </li>
                <li>
                  <a
                    href="https://github.com/withcatai/node-llama-cpp"
                    target="_blank"
                    className="font-black text-primary text-xl"
                  >
                    withcatai
                  </a>
                  {" have integrated llama.cpp to node module."}
                </li>
                <li>
                  <a
                    href="https://github.com/ggerganov/llama.cpp"
                    target="_blank"
                    className="font-black text-primary text-xl"
                  >
                    ggerganov
                  </a>
                  {
                    " the hard work done here to make possible LLM inference through C++ with a minimal setup."
                  }
                </li>
              </ul>
            </div>
          </div>
          <div className="py-8">
            <Link className="btn btn-primary shadow-lg" tabIndex={0} to="/chat">
              Go to chat page
            </Link>
          </div>
        </div>
      </React.Fragment>
    </HomeLayout>
  );
}

export default About;
