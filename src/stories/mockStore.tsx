import { configureStore } from "@reduxjs/toolkit";
import reducer, { initialState, State } from "../reducers/reducer";

export default function mockStore(state: State) {
    return configureStore({
        reducer: reducer,
        preloadedState: state,
        devTools: true
    });
};