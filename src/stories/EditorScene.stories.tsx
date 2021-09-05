import React from "react";
import { Meta, Story } from "@storybook/react";
import EditorScene from "../components/EditorScene/EditorScene";
import { Provider, useDispatch, useSelector } from "react-redux";
import mockStore from "./mockStore";
import produce from "immer";
import { initialState } from "../reducers/reducer";
import Literal3DVector from "../components/Literal/LiteralVector3D/LiteralVector3D";
import { State } from "../reducers/reducer";
import { SceneObject, SceneObjectId } from "../reducers/scenes";
import defaultState from "../defaultState";

export default {
  component: EditorScene,
  title: "Components/EditorScene",
} as Meta;

export const Default = () => {
  const store = mockStore(defaultState);
  return (
    <Provider store={store}>
      <EditorScene id="Level 1" />
    </Provider>
  );
};

const Controls = (props: { sceneId: string; objectId: string }) => {
  const value = useSelector(
    (state: State) =>
      state.current.scenes[props.sceneId].objects[props.objectId].attributes
        .Position
  );
  const dispatch = useDispatch();

  return (
    <Literal3DVector
      value={value.value}
      onSubmit={
        (value) => {}
        // Dispatch set object position
      }
    />
  );
};

export const WithControls = () => {
  const store = mockStore(defaultState);

  return (
    <Provider store={store}>
      <EditorScene id="Level 1" />
      <Controls sceneId="Level 1" objectId="2" />
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
          name: id.toString(),
          type: "Mesh",
          attributes: {
            Position: {
              type: "Vector3D",
              value: {
                x: x * 0.2,
                y: y * 0.2,
                z: z * 0.2,
              },
            },
            Rotation: {
              type: "Vector3D",
              value: {
                x: 0,
                y: 0,
                z: 0,
              },
            },
            Size: {
              type: "Vector3D",
              value: {
                x: 0.1,
                y: 0.1,
                z: 0.1,
              },
            },
            Mesh: {
              type: "Mesh",
              value: "Box",
            },
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
            name: "Light",
            type: "Directional Light",
            attributes: {
              Position: {
                type: "Vector3D",
                value: {
                  x: -1,
                  y: 2,
                  z: 4,
                },
              },
              "Light Target": {
                type: "Vector3D",
                value: {
                  x: 0,
                  y: 0,
                  z: 0,
                },
              },
              Color: {
                type: "Color",
                value: {
                  r: 255,
                  g: 255,
                  b: 255,
                },
              },
              Intensity: {
                type: "Float",
                value: 1,
              },
            },
          },
          ...cubes,
        },
      };
      state.current.meshes["Box"] = {
        geometry: {
          type: "Primitive",
          primitive: "Box",
        },
        material: "Blue",
      };
      state.current.materials["Blue"] = {
        type: "Phong",
        color: 0x44aa88,
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
