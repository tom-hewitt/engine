import React from "react";
import { Meta } from "@storybook/react";
import FunctionCard from "../components/FunctionCard/FunctionCard";
import mockStore from "./mockStore";
import produce from "immer";
import { initialState } from "../reducers/reducer";
import { Provider } from "react-redux";
import BlocksDndContext from "../components/BlocksDndContext/BlocksDndContext";
import SceneObjectCard from "../components/SceneObjectCard/SceneObjectCard";
import defaultState from "../defaultState";

export default {
  component: SceneObjectCard,
  title: "Components/SceneObjectCard",
} as Meta;

export const Default = () => {
  const store = mockStore(defaultState);

  return (
    <Provider store={store}>
      <BlocksDndContext>
        <SceneObjectCard id="0" sceneId="Level 1" />
      </BlocksDndContext>
    </Provider>
  );
};
