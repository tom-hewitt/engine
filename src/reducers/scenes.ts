import { createAction, createReducer } from "@reduxjs/toolkit";
import { HexBase64BinaryEncoding } from "crypto";

export interface ScenesState {
  [key: string]: Scene;
}

export interface Scene {
  children?: SceneObjectId[];
  objects: SceneObjects;
}

export interface SceneObjects {
  [key: string]: SceneObject;
}

export type SceneId = string;

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

export const scenesInitialState: ScenesState = {};

export const setObjectPosition = createAction(
  "scenes/SET_OBJECT_POSITION",
  (sceneId: SceneId, objectId: SceneObjectId, position: vector3d) => ({
    payload: {
      undo: false,
      sceneId,
      objectId,
      position,
    },
  })
);

const scene = createReducer(scenesInitialState, (builder) => {
  builder.addCase(
    setObjectPosition,
    (state, { payload: { undo, sceneId, objectId, position } }) => {
      state[sceneId].objects[objectId].position = position;
    }
  );
});

export default scene;
