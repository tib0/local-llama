const ChatBubbleUser = ({ index, text }: { index: string; text: string }) => (
  <div
    key={`user-chat-${index}`}
    className={`
      card my-1 sm:my-2 py-2 px-4 w-max max-w-[90%] self-end 
      text-base-content border border-primary/40 
      bg-base-100/70 backdrop-blur-lg shadow-md
    `}
  >
    <div className="card-title p-0 text-left">
      <div className="prose w-full max-w-full">{"Vous :"}</div>
    </div>
    <div className="card-body p-0 text-left">
      <div className="prose w-full max-w-full">{text.toString()}</div>
    </div>
  </div>
);

export default ChatBubbleUser;
