import { createReducer } from "@reduxjs/toolkit";
import { MaterialId } from "./materials";

export interface MeshesState {
  [key: string]: Mesh;
}

export type MeshId = string;

export interface Mesh {
  geometry: Geometry;
  material: MaterialId;
}

export type Geometry = PrimitiveGeometry;

export type PrimitiveGeometry = BoxGeometry | PlaneGeometry;

interface Primitive {
  type: "Primitive";
}

export interface BoxGeometry extends Primitive {
  primitive: "Box";
}

export interface PlaneGeometry extends Primitive {
  primitive: "Plane";
}

export const meshesInitialState: MeshesState = {};

const meshes = createReducer(meshesInitialState, (builder) => {});
