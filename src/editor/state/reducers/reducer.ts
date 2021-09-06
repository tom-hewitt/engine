import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import produce from "immer";
import current, { CurrentState, initialCurrentState } from "./current";
import temp, { initialTempState, TempState } from "./temp";

type ReversibleAction = PayloadAction<{ undo: boolean; [key: string]: any }>;

export interface State {
  current: CurrentState;
  history: ReversibleAction[];
  index: number;
  undoMessage?: string;
  temp: TempState;
}

export const initialState: State = {
  current: initialCurrentState,
  history: [],
  index: 0,
  temp: initialTempState,
};

export const undo = createAction("UNDO");

export const redo = createAction("REDO");

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(undo, (state) => {
      // If there is an action to undo
      if (state.index > 0) {
        state.index--;
        const action = produce(state.history[state.index], (action) => {
          action.payload.reverse = true;
        });
        state.current = current(state.current, action);
      } else {
        state.undoMessage = "Nothing to undo!";
      }
    })
    .addCase(redo, (state) => {
      if (state.index < state.history.length - 1) {
        const action = state.history[state.index];
        state.index++;
        state.current = current(state.current, action);
      } else {
        state.undoMessage = "Nothing to redo!";
      }
    })
    .addDefaultCase((state, action) => {
      if (action.payload && action.payload.undo === false) {
        state.history.splice(
          state.index,
          state.history.length - state.index,
          action as ReversibleAction
        );
        state.index++;
      }
      state.current = current(state.current, action);
      state.temp = temp(state.temp, action);
    });
});

export default reducer;
