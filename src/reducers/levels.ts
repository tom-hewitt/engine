import { createReducer } from "@reduxjs/toolkit";
import { HexBase64BinaryEncoding } from "crypto";

export interface LevelsState {
  [key: string]: Level;
}

export interface Level {
  children?: SceneObjectId[];
  scene: Scene;
}

export interface Scene {
  [key: string]: SceneObject;
}

export type SceneObjectId = string;

export type SceneObject = DirectionalLight | Box;

interface BaseSceneObject {
  parent?: string;
  children?: SceneObjectId[];
  position: vector3d;
}

export interface DirectionalLight extends BaseSceneObject {
  objectType: "Directional Light";
  lightTarget: vector3d;
  color: number;
  intensity: number;
}

export interface Box extends BaseSceneObject {
  objectType: "Box";
  size: vector3d;
}

export const levelsInitialState: LevelsState = {};

const scene = createReducer(levelsInitialState, (builder) => {});
