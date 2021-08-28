import React from "react";
import { Meta, Story } from "@storybook/react";
import EditorScene from "../components/EditorScene/EditorScene";
import { Provider, useDispatch, useSelector } from "react-redux";
import mockStore from "./mockStore";
import produce from "immer";
import { initialState } from "../reducers/reducer";
import Literal3DVector from "../components/Literal/Literal3DVector/Literal3DVector";
import { State } from "../reducers/reducer";
import {
  SceneObject,
  SceneObjectId,
  setObjectPosition,
} from "../reducers/scenes";

export default {
  component: EditorScene,
  title: "Components/EditorScene",
} as Meta;

export const Default = () => {
  const store = mockStore(
    produce(initialState, (state) => {
      state.current.scenes["Level 1"] = {
        children: ["0", "1"],
        objects: {
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

const Controls = (props: { sceneId: string; objectId: string }) => {
  const value = useSelector(
    (state: State) =>
      state.current.scenes[props.sceneId].objects[props.objectId].position
  );
  const dispatch = useDispatch();

  return (
    <Literal3DVector
      value={value}
      onSubmit={(value) =>
        dispatch(setObjectPosition(props.sceneId, props.objectId, value))
      }
    />
  );
};

export const WithControls = () => {
  const store = mockStore(
    produce(initialState, (state) => {
      state.current.scenes["Level 1"] = {
        children: ["0", "1"],
        objects: {
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
      <Controls sceneId="Level 1" objectId="1" />
    </Provider>
  );
};

const StressTestComponent: Story<{ n: number }> = (args) => {
  let cubeIds: SceneObjectId[] = [];
  let cubes: { [key: string]: SceneObject } = {};

  for (let x = 0; x < args.n; x++) {
    for (let y = 0; y < args.n; y++) {
      for (let z = 0; z < args.n; z++) {
        const id = `${x}, ${y}, ${z}`;
        cubeIds.push(id);
        cubes[id] = {
          objectType: "Box",
          position: {
            x: x * 0.2,
            y: y * 0.2,
            z: z * 0.2,
          },
          size: {
            x: 0.1,
            y: 0.1,
            z: 0.1,
          },
        };
      }
    }
  }

  const store = mockStore(
    produce(initialState, (state) => {
      state.current.scenes["Level 1"] = {
        children: ["light", ...cubeIds],
        objects: {
          light: {
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
          ...cubes,
        },
      };
    })
  );

  return (
    <Provider store={store}>
      <EditorScene id="Level 1" />
      <Controls sceneId="Level 1" objectId="0, 0, 0" />
    </Provider>
  );
};

export const StressTest = StressTestComponent.bind({});

StressTest.args = {
  n: 10,
};
