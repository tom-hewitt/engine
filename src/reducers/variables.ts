import { createReducer } from "@reduxjs/toolkit";
import { BlockId } from "./blocks";

export type VariableId = string;

export interface VariablesState {
  [key: string]: VariableDefinition;
}

export interface VariableDefinition {
  name: string;
  references: BlockId[];
}

const variables = createReducer;
