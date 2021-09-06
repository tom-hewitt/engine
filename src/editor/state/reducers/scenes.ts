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

interface Attributes {
  [key: string]: Literal;
}

interface Position {
  Position: LiteralVector3D;
}

interface Rotation {
  Rotation: LiteralVector3D;
}

interface Size {
  Size: LiteralVector3D;
}

export interface DirectionalLight extends Object {
  type: "Directional Light";
  attributes: DirectionalLightAttributes;
}

export interface DirectionalLightAttributes extends Attributes, Position {
  "Light Target": LiteralVector3D;
  Color: LiteralColor;
  Intensity: LiteralFloat;
}

export interface Mesh extends Object {
  type: "Mesh";
  attributes: MeshAttributes;
}

export interface MeshAttributes extends Attributes, Position, Rotation, Size {
  Geometry: LiteralGeometry;
  Material: LiteralMaterial;
}

export const scenesInitialState: ScenesState = {};

export const setObjectAttribute = createAction(
  "scenes/SET_OBJECT_POSITION",
  (
    sceneId: SceneId,
    objectId: SceneObjectId,
    attribute: string,
    literal: Literal
  ) => ({
    payload: {
      undo: false,
      sceneId,
      objectId,
      attribute,
      literal,
    },
  })
);

const scene = createReducer(scenesInitialState, (builder) => {
  builder.addCase(
    setObjectAttribute,
    (state, { payload: { undo, sceneId, objectId, attribute, literal } }) => {
      state[sceneId].objects[objectId].attributes[attribute] = literal;
    }
  );
});

export default scene;
