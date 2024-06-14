import React from "react";
import HomeLayout from "../layout/home";
import ChatForm from "../components/chat-form";

function Chat(): JSX.Element {
  return (
    <HomeLayout>
      <React.Fragment>
        <div
          className={`
            flex flex-col items-center
            justify-center
            gap-3
          `}
        >
          <div className="w-full max-w-full sm:w-[80%] sm:max-w-4xl">
            <ChatForm />
          </div>
        </div>
      </React.Fragment>
    </HomeLayout>
  );
}

export default Chat;
