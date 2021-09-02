import { createAction, createReducer } from "@reduxjs/toolkit";

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

export type SceneObject = DirectionalLight | Mesh;

interface Object {
  name: string;
  parent?: string;
  children?: SceneObjectId[];
}

interface Position {
  position: vector3d;
}

interface Rotation {
  rotation: vector3d;
}

interface Size {
  size: vector3d;
}

export interface DirectionalLight extends Object, Position, Rotation {
  type: "Directional Light";
  lightTarget: vector3d;
  color: number;
  intensity: number;
}

export interface Mesh extends Object, Position, Rotation, Size {
  type: "Mesh";
  mesh: string;
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
