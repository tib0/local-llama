import { Link } from "react-router-dom";
import React from "react";
import AboutLayout from "../layout/about";
import images from "../lib/images";

function About(): JSX.Element {
  return (
    <AboutLayout>
      <React.Fragment>
        <div className={`min-h-[calc(100vh-5rem)] text-center`}>
          <div className="flex justify-center">
            <img className="max-w-64 pt-4" src={images.logo} />
          </div>
          <div>
            <div>
              <p className="font-medium">
                This recreational project aim to help you run LLM models locally 🚀
              </p>
              <p className="font-medium">
                With local llama, you can safely use Llama 3 models without needing to register
                to any exernal services.
              </p>
              <p className="font-medium">
                {
                  'You will be able to run gguf models. You can find them by searching for "gguf" at '
                }
                <a
                  className={`link link-primary font-black`}
                  aria-label="Hugginface search for gguf"
                  target="blank"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.electronAPI.openExternalLink(
                      "https://huggingface.co/models?search=gguf",
                    );
                  }}
                >
                  Hugginface.co
                </a>
              </p>
              <div className="flex flex-col justify-center items-center">
                <ul className="text-left list-none list-inside mx-4 py-2 max-w-lg">
                  <li className="mt-1">
                    <span className="font-black text-primary text-xl mr-1">1</span>
                    {' Choose the model you want to run by clicking the "Model..." button.'}
                  </li>
                  <li className="mt-1">
                    <span className="font-black text-primary text-xl mr-1">2</span>
                    {
                      " Adjust the GPU setting for optimal performance using Vulkan, CUDA, Metal,"
                    }
                    or no GPU at all.
                  </li>
                  <li className="mt-1">
                    <span className="font-black text-primary text-xl mr-1">3</span>
                    {
                      " Regulate the temperature slider to define your desired level (maximum is 2, minimum is 0)."
                    }
                  </li>
                  <li className="mt-1">
                    <span className="font-black text-primary text-xl mr-1">4</span>
                    {" Begin conversing!"}
                  </li>
                  <li className="mt-1">
                    <span className="font-black text-primary text-xl mr-1">5</span>
                    {" You can save chat history to track previous discussions."}
                  </li>
                  <li className="my-1">
                    <span className="font-black text-primary text-xl mr-1">6</span>
                    {" You can load chat history to continue previous discussions."}
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <div className="p-0 m-4 max-w-[460px] w-7/12 h-0.5 rounded-full shadow-xl bg-primary/50"></div>
            </div>
            <div className="flex flex-col justify-center items-center pt-2">
              <p className="font-medium">
                This project would not have come to life without the amazing work done by the
                awsome teams and people:
              </p>
              <ul className="text-left list-none list-inside mx-4 py-2 max-w-lg">
                <li className="mt-1">
                  <a
                    className={`link font-black text-primary text-xl mr-1`}
                    aria-label="ggerganov github"
                    target="blank"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.electronAPI.openExternalLink(
                        "https://github.com/fozziethebeat/electron-forge-plugin-vite-esm#plugin-vite-esm",
                      );
                    }}
                  >
                    fozziethebeat
                  </a>
                  {
                    " from SurfaceData team, with plugin-vite-esm he'd tackle down complex integration of node-llama-cpp inside an electron app."
                  }
                </li>
                <li className="mt-1">
                  <a
                    className={`link font-black text-primary text-xl mr-1`}
                    aria-label="giladgd github"
                    target="blank"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.electronAPI.openExternalLink(
                        "https://github.com/withcatai/node-llama-cpp",
                      );
                    }}
                  >
                    giladgd
                  </a>
                  {" from withcatai team have integrated llama.cpp to node."}
                </li>
                <li className="mt-1">
                  <a
                    className={`link font-black text-primary text-xl mr-1`}
                    aria-label="ggerganov github"
                    target="blank"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.electronAPI.openExternalLink(
                        "https://github.com/ggerganov/llama.cpp",
                      );
                    }}
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
    </AboutLayout>
  );
}

export default About;
