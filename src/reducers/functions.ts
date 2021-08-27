import { createReducer } from "@reduxjs/toolkit";
import { BlockId } from "./blocks";
import { VariableId } from "./variables";

export type FunctionId = string;

export interface Function {
  name: string;
  blocksContainer: BlockId;
  variables: VariableId[];
  blockReferences: BlockId[];
}

export interface FunctionsState {
  [key: string]: Function;
}

export const functionsInitialState: FunctionsState = {};

const functions = createReducer(functionsInitialState, (builder) => {});

export default functions;
