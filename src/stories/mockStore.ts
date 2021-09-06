import { configureStore } from "@reduxjs/toolkit";
import reducer, { State } from "../editor/state/reducers/reducer";

export default function mockStore(state: State) {
  return configureStore({
    reducer: reducer,
    preloadedState: state,
    devTools: true,
  });
}
