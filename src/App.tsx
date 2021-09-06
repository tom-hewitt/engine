import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Editor from "./editor/gui/components/Editor/Editor";
import reducer from "./editor/state/reducers/reducer";
import defaultState from "./editor/state/defaults/defaultState";

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
