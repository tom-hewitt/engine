import { createReducer } from "@reduxjs/toolkit";

export interface MaterialsState {
  [key: string]: Material;
}

export type MaterialId = string;

export type Material = PhongMaterial;

export interface PhongMaterial {
  type: "Phong";
  color: number;
}

export const materialsIntitialState: MaterialsState = {};

const materials = createReducer(materialsIntitialState, (builder) => {});
