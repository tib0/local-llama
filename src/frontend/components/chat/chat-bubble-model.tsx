import { SpeakerIcon } from "../../lib/icons";
import { speechSynthesis } from "../../lib/textToSpeech";
import { MarkdownRenderer } from "../markdown";

const ChatBubbleModel = ({ index, text }: { index: string; text: string }) => (
  <div
    key={`model-chat-${index}`}
    className={`
      card my-1 sm:my-2 py-2 px-4 
      w-max max-w-[90%] self-start
      text-base-content border border-secondary/30 
      bg-base-100/70 backdrop-blur-lg shadow-md
    `}
  >
    <div className="card-title p-0 text-left">
      <div className="prose w-full max-w-full">{"Model: "}</div>
      <div
        className={`hover:cursor-pointer rounded-full w-4 h-4`}
        tabIndex={0}
        onClick={() => speechSynthesis(text)}
      >
        <SpeakerIcon />
      </div>
    </div>
    <div className="card-body p-0 text-left">
      <div className="prose prose-pre:bg-[#1E1E1E] prose-p:text-base prose-span:text-base w-full max-w-full ">
        <MarkdownRenderer>{text}</MarkdownRenderer>
      </div>
    </div>
  </div>
);

export default ChatBubbleModel;
