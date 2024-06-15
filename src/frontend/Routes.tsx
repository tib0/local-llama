import { HashRouter, Route, Routes } from "react-router-dom";

import About from "./pages/About";
import Chat from "./pages/Chat";
import Error from "./pages/Error";
import React from "react";
import ChatProvider from "./providers/chat";

function App(): JSX.Element {
  return (
    <React.StrictMode>
      <ChatProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </HashRouter>
      </ChatProvider>
    </React.StrictMode>
  );
}

export default App;
