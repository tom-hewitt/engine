import { createReducer } from "@reduxjs/toolkit";

export interface ClassesState {
  [key: string]: Class;
}

export interface Class {
  name: string;
}

export const classesInitialState: ClassesState = {};

const classes = createReducer(classesInitialState, (builder) => {});
