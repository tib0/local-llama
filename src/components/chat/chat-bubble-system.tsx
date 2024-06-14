const ChatBubbleSystem = ({ index, text }: { index: string; text: string }) => (
  <div
    key={`system-chat-${index}`}
    className={`
      card my-2 py-2 px-4 w-max max-w-[90%] self-center 
      text-base-content border border-red-400/30 
      bg-base-100/70 backdrop-blur-lg shadow-md
    `}
  >
    <div className="card-title p-0 text-center">
      <div className="prose w-full max-w-full">{"Système :"}</div>
    </div>
    <div className="card-body p-0 text-center">
      <div className="prose w-full max-w-full">{text.toString()}</div>
    </div>
  </div>
);

export default ChatBubbleSystem;
