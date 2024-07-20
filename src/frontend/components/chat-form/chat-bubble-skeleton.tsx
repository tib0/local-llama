import MarkdownRenderer from "../markdown";

const ChatBubbleSkeleton = ({ text }: { text: string }) => (
  <div
    key={`model-chat-skel`}
    className={`
    hover:cursor-wait
    card my-1 sm:my-2 py-2 px-4 w-full max-w-[90%] self-start 
    text-base-content border border-secondary/30 
    bg-base-100/70 backdrop-blur-lg shadow-md
    `}
  >
    <div className="card-title p-0 text-left">
      <div className="prose">{"Model :"}</div>
    </div>
    <div className="card-body p-0 text-left">
      <div className="prose prose-pre:bg-[#1E1E1E] prose-p:text-base prose-span:text-base w-full max-w-full">
        {text ? (
          <MarkdownRenderer>{text}</MarkdownRenderer>
        ) : (
          <>
            <div className="skeleton h-3 mb-1 w-full"></div>
            <div className="skeleton h-3 mb-1 w-full"></div>
            <div className="skeleton h-3 mb-1 w-3/4"></div>
          </>
        )}
      </div>
    </div>
  </div>
);

export default ChatBubbleSkeleton;
