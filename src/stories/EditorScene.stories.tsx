import React from "react";
import { Meta } from "@storybook/react";
import EditorScene from "../components/EditorScene/EditorScene";
import { Provider } from "react-redux";
import mockStore from "./mockStore";
import produce from "immer";
import { initialState } from "../reducers/reducer";

export default {
  component: EditorScene,
  title: "Components/EditorScene",
} as Meta;

export const Default = () => {
  const store = mockStore(
    produce(initialState, (state) => {
      state.current.levels["Level 1"] = {
        children: ["0", "1"],
        scene: {
          "0": {
            objectType: "Directional Light",
            position: {
              x: -1,
              y: 2,
              z: 4,
            },
            lightTarget: {
              x: 0,
              y: 0,
              z: 0,
            },
            color: 0xffffff,
            intensity: 1,
          },
          "1": {
            objectType: "Box",
            position: {
              x: 0,
              y: 0,
              z: 0,
            },
            size: {
              x: 1,
              y: 1,
              z: 1,
            },
          },
        },
      };
    })
  );
  return (
    <Provider store={store}>
      <EditorScene id="Level 1" />
    </Provider>
  );
};
