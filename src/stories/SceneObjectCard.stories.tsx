import React from "react";
import { Meta } from "@storybook/react";
import FunctionCard from "../editor/gui/components/FunctionCard/FunctionCard";
import mockStore from "./mockStore";
import produce from "immer";
import { initialState } from "../editor/state/reducers/reducer";
import { Provider } from "react-redux";
import BlocksDndContext from "../editor/gui/components/BlocksDndContext/BlocksDndContext";
import SceneObjectCard from "../editor/gui/components/SceneObjectCard/SceneObjectCard";
import defaultState from "../editor/state/defaults/defaultState";

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
