import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Editor from "./components/Editor/Editor";
import reducer from "./reducers/reducer";
import defaultState from "./defaultState";

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
