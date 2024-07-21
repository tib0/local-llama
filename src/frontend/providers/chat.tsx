import { createContext, useEffect, useReducer } from "react";
import usePersistentStorageValue from "../hooks/usePersistentStorageValue";
import { ChatHistoryItem } from "../lib/llamaNodeCppWrapper";

const initialState: {
  history: ChatHistoryItem[];
  lhistory: boolean;
} = {
  history: [] as ChatHistoryItem[],
  lhistory: false as boolean,
};

export const ChatContext = createContext({
  state: initialState,
  dispatch: () => null,
} as any);

const reducer = (
  state: { history: ChatHistoryItem[]; lhistory: boolean },
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case "PROMPT_CHAT":
      return { ...state, history: state.history.concat(action.payload), lhistory: false };
    case "PERSIST_CHAT":
      return { ...state, history: action.payload, lhistory: false };
    case "LOAD_CHAT":
      return { ...state, history: action.payload, lhistory: true };
    case "CLEAR_HISTORY":
      return { ...state, history: [], lhistory: false };
    default:
      return state;
  }
};

export default function ChatProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [_history, setHistory] = usePersistentStorageValue("chatHistory", "");

  useEffect(() => {
    if (state.history && state.history.length > 1) setHistory(JSON.stringify(state.history));
  }, [state.history]);

  return <ChatContext.Provider value={{ state, dispatch }}>{children}</ChatContext.Provider>;
}
