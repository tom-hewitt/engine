import { configureStore } from "@reduxjs/toolkit";
import reducer, { State } from "../reducers/reducer";

export default function mockStore(state: State) {
    return configureStore({
        reducer: reducer,
        preloadedState: state,
        devTools: true
    });
};