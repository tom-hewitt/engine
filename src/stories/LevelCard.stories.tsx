import React from "react";
import { Meta } from "@storybook/react";
import LevelCard from "../components/LevelCard/LevelCard";
import mockStore from "./mockStore";
import produce from "immer";
import { initialState } from "../reducers/reducer";
import { Provider } from "react-redux";
import defaultState from "../defaultState";

export default {
  component: LevelCard,
  title: "Components/LevelCard",
};

export const Default = () => {
  const store = mockStore(defaultState);

  return (
    <Provider store={store}>
      <LevelCard id="Level 1" />
    </Provider>
  );
};
