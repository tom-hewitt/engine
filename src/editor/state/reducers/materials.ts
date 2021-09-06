import { createReducer } from "@reduxjs/toolkit";

export interface MaterialsState {
  [key: string]: Material;
}

export type MaterialId = string;

export interface Material {
  color: rgb;
  opacity: number;
  emissive: rgb;
  roughness: number;
  metalness: number;
  flatShading?: boolean;
}

export const materialsIntitialState: MaterialsState = {};

const materials = createReducer(materialsIntitialState, (builder) => {});
