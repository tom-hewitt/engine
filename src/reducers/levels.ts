import { createReducer } from "@reduxjs/toolkit";
import { SceneId } from "./scenes";

export interface LevelsState {
  [key: string]: Level;
}

export interface Level {
  name: string;
  scene: SceneId;
}

export type LevelId = string;

export const levelsInitialState: LevelsState = {};

const levels = createReducer(levelsInitialState, (builder) => {});

export default levels;
