import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";
import Editor from "./components/Editor/Editor";
import reducer from "./reducers/reducer";
import defaultState from "./defaultState";

createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap');
`;

export default function App() {
  const store = configureStore({
    reducer: reducer,
    preloadedState: defaultState,
    devTools: true,
  });

  return (
    <Provider store={store}>
      <Editor />
    </Provider>
  );
}
