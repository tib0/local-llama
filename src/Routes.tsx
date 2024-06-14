import { HashRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Chat from "./pages/Chat";
import React from "react";
import ChatProvider from "./providers/chat";

function App(): JSX.Element {
  return (
    <React.StrictMode>
      <ChatProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </HashRouter>
      </ChatProvider>
    </React.StrictMode>
  );
}

export default App;
